const abi = [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_orderBookAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        }
      ],
      "name": "getDecreaseOrders",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_orderBookAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        }
      ],
      "name": "getIncreaseOrders",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_orderBookAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_indices",
          "type": "uint256[]"
        }
      ],
      "name": "getSwapOrders",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  
module.exports = {abi};