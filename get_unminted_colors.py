import requests
import csv
from web3 import Web3
import time
import json
import os

def can_condense_hex(hex_color):
    return (hex_color[0] == hex_color[1] and 
            hex_color[2] == hex_color[3] and 
            hex_color[4] == hex_color[5])

def condense_hex(hex_color):
    return f"#{hex_color[1]}{hex_color[3]}{hex_color[5]}"

def expand_color(color):
    if len(color) == 4:  # '#RGB' format
        return f"#{color[1]*2}{color[2]*2}{color[3]*2}"
    return color.upper()

def get_minted_colors():
    url = "https://api.basescan.org/api"
    base_params = {
        "module": "logs",
        "action": "getLogs",
        "fromBlock": 16118016,  # Start from the first relevant block
        "toBlock": "latest",
        "address": "0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB",
        "apikey": "Q9FI8FGJISXKAKBDX28UFYR731G9UYYUQ5"
    }

    # Define topics for TokenMinted and TokensMinted events
    topic_token_minted = "0x4e501b7ed20ed00ab45bf6bdfe315ee8cea82218c0680b05b465207dafd47d01"
    topic_tokens_minted = "0xaf123eddc2f8407409724cdf32d91921ff69e838afb133befd4db491960bf88b"

    w3 = Web3(Web3.HTTPProvider("https://mainnet.base.org"))

    # Load ABI from file
    with open("base-colors-abi.json", "r") as abi_file:
        abi_data = json.load(abi_file)
        abi = json.loads(abi_data["result"])

    contract = w3.eth.contract(abi=abi)

    minted_colors = {}  # Dictionary to store full colors and transaction IDs
    condensed_colors = {}  # Dictionary to store condensed colors and transaction IDs
    unique_event_names = set()  # Set to store unique event names
    total_logs = 0

    for topic in [topic_token_minted, topic_tokens_minted]:
        current_block = base_params["fromBlock"]
        params = base_params.copy()
        params["topic0"] = topic

        while True:
            params["fromBlock"] = current_block
            params["toBlock"] = current_block + 999999

            response = requests.get(url, params=params)
            data = response.json()

            if data["status"] != "1" or not data["result"]:
                if current_block >= w3.eth.get_block('latest')['number']:
                    break
                current_block = params["toBlock"] + 1
                continue

            logs_count = len(data["result"])
            total_logs += logs_count
            for log in data["result"]:
                log_entry = {
                    "topics": log["topics"],
                    "data": log["data"],
                    "address": log["address"],
                    "blockNumber": log["blockNumber"],
                    "transactionHash": log["transactionHash"],
                    "transactionIndex": log["transactionIndex"],
                    "blockHash": log["blockHash"],
                    "logIndex": log["logIndex"]
                }
                try:
                    for event in contract.events:
                        try:
                            decoded_log = event().process_log(log_entry)
                            
                            unique_event_names.add(event.event_name)
                            
                            if event.event_name == "TokensMinted" or event.event_name == "TokenMinted":
                                colors_in_log = []
                                if event.event_name == "TokensMinted":
                                    colors = decoded_log['args']['colors']
                                else:  # TokenMinted
                                    colors = [decoded_log['args']['color']]
                                
                                for color in colors:
                                    hex_color = color.upper()  # Keep the '#' prefix
                                    full_color = hex_color
                                    transaction_hash = log["transactionHash"]
                                    minted_colors[full_color] = transaction_hash
                                    colors_in_log.append(full_color)
                                    if can_condense_hex(hex_color[1:]):  # Pass without '#'
                                        condensed_color = condense_hex(hex_color[1:])
                                        condensed_colors[condensed_color] = transaction_hash
                                
                                # print(f"Colors in log: {colors_in_log} - {transaction_hash}")
                            break
                        except:
                            continue
                    else:
                        pass
                except Exception as e:
                    print(f"Error processing log: {e}")

            # print(f"Processed blocks {current_block} to {params['toBlock']}, total logs: {total_logs}, unique colors: {len(minted_colors)}, condensed colors: {len(condensed_colors)}")
            
            last_block = int(data["result"][-1]["blockNumber"], 16)
            if current_block >= last_block:
                break
            current_block = last_block + 1

            time.sleep(0.2)

    print("\nUnique event names encountered:")
    for event_name in sorted(unique_event_names):
        print(f"- {event_name}")

    return minted_colors, condensed_colors

def main():
    print("Fetching minted colors...")
    minted_colors, condensed_colors = get_minted_colors()
    print(f"Found {len(minted_colors)} minted colors and {len(condensed_colors)} condensed colors.")

    print("Generating all possible condensable colors...")
    all_colors = set(f"#{r:01X}{g:01X}{b:01X}" for r in range(16) for g in range(16) for b in range(16))
    print(f"Total possible colors: {len(all_colors)}")
    print("Calculating unminted colors...")
    unminted_colors = all_colors - set(condensed_colors.keys())

    print("\nComparisons:")
    print(f"Total possible colors: {len(all_colors)}")
    print(f"Minted colors: {len(minted_colors)}")
    print(f"Unminted colors: {len(unminted_colors)}")
    
    print(f"\nPercentage minted: {(len(minted_colors) / len(all_colors)) * 100:.2f}%")
    print(f"Percentage unminted: {(len(unminted_colors) / len(all_colors)) * 100:.2f}%")

    # Check if #000000 is minted
    if "#000000" in minted_colors:
        print("\n#000000 is minted")
    else:
        print("\n#000000 is not minted")

    print("\nWriting results to CSV files...")
    
    # Create the public directory if it doesn't exist
    public_dir = "public"
    os.makedirs(public_dir, exist_ok=True)

    # Write unminted colors to CSV in the public directory
    unminted_colors_path = os.path.join(public_dir, "unminted_colors.csv")
    with open(unminted_colors_path, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["HEX CODE", "Expanded HEX"])
        for color in sorted(unminted_colors):
            expanded_color = expand_color(color)
            writer.writerow([color, expanded_color])

    # Write minted colors to CSV (remains in the current directory)
    with open("minted_colors.csv", "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["HEX CODE", "Transaction ID"])
        for color, transaction_id in sorted(minted_colors.items()):
            writer.writerow([color, transaction_id])

    print(f"Total unminted colors: {len(unminted_colors)}")
    print(f"CSV file '{unminted_colors_path}' has been created.")
    print(f"Total minted colors: {len(minted_colors)}")
    print("CSV file 'minted_colors.csv' has been created.")

if __name__ == "__main__":
    main()