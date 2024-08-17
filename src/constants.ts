export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const BASE_MAINNET_CHAIN_ID = 8453;

export const comment = 'Minting a hex color that can be abbreviated.';
export const mintContractAddress = '0x777777722D078c97c6ad07d9f36801e653E356Ae';

export const mintABI = [{ 
  "inputs": [
    { "internalType": 'string', "name": 'color', "type": 'string' }, 
    { "internalType": 'string', "name": 'name', "type": 'string' }, 
    { "internalType": 'address', "name": 'recipient', "type": 'address' }
  ], 
  name: 'mint', 
  outputs: 
  [], 
  stateMutability: 'payable', 
  type: 'function' 
}];


