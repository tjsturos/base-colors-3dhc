export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_MAINNET_CHAIN_ID = 8453;

export const comment = 'Minting a hex color that can be abbreviated.';
export const mintContractAddress = '0x7Bc1C072742D8391817EB4Eb2317F98dc72C61dB';

export const mintABI = [
  { 
    "inputs": [
      { "internalType": 'string', "name": 'color', "type": 'string' }, 
      { "internalType": 'string', "name": 'name', "type": 'string' }, 
      { "internalType": 'address', "name": 'recipient', "type": 'address' }
    ], 
    "name": 'mint', 
    "outputs": [], 
    "stateMutability": 'payable', 
    "type": 'function' 
  },
  {
    "inputs": [
      { "internalType": "string[]", "name": "colors", "type": "string[]" },
      { "internalType": "string[]", "name": "names", "type": "string[]" },
      { "internalType": "uint256", "name": "quantity", "type": "uint256" },
      { "internalType": "address", "name": "recipient", "type": "address" }
    ],
    "name": "mintBatch",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export const costABI = [{
  "inputs": [],
  "name": "mintPrice",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
}];