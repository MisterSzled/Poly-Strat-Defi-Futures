const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "CancelDecreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "purchaseToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "purchaseTokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "CancelIncreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerRatio",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "shouldUnwrap",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "CancelSwapOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "CreateDecreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "purchaseToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "purchaseTokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "CreateIncreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerRatio",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "shouldUnwrap",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "CreateSwapOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionPrice",
          "type": "uint256"
        }
      ],
      "name": "ExecuteDecreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "purchaseToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "purchaseTokenAmount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionPrice",
          "type": "uint256"
        }
      ],
      "name": "ExecuteIncreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerRatio",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "shouldUnwrap",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "ExecuteSwapOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "router",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "vault",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "weth",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "usdg",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minExecutionFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPurchaseTokenAmountUsd",
          "type": "uint256"
        }
      ],
      "name": "Initialize",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        }
      ],
      "name": "UpdateDecreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "gov",
          "type": "address"
        }
      ],
      "name": "UpdateGov",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "orderIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        }
      ],
      "name": "UpdateIncreaseOrder",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minExecutionFee",
          "type": "uint256"
        }
      ],
      "name": "UpdateMinExecutionFee",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minPurchaseTokenAmountUsd",
          "type": "uint256"
        }
      ],
      "name": "UpdateMinPurchaseTokenAmountUsd",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "ordexIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "path",
          "type": "address[]"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minOut",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "triggerRatio",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "shouldUnwrap",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "name": "UpdateSwapOrder",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "PRICE_PRECISION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "USDG_PRECISION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        }
      ],
      "name": "cancelDecreaseOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        }
      ],
      "name": "cancelIncreaseOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256[]",
          "name": "_swapOrderIndexes",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_increaseOrderIndexes",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "_decreaseOrderIndexes",
          "type": "uint256[]"
        }
      ],
      "name": "cancelMultiple",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        }
      ],
      "name": "cancelSwapOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_indexToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_collateralToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_collateralDelta",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_isLong",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        }
      ],
      "name": "createDecreaseOrder",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_path",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_amountIn",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_indexToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_minOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_collateralToken",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_isLong",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_executionFee",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_shouldWrap",
          "type": "bool"
        }
      ],
      "name": "createIncreaseOrder",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_path",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_triggerRatio",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_executionFee",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_shouldWrap",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "_shouldUnwrap",
          "type": "bool"
        }
      ],
      "name": "createSwapOrder",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "decreaseOrders",
      "outputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "decreaseOrdersIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "_feeReceiver",
          "type": "address"
        }
      ],
      "name": "executeDecreaseOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "_feeReceiver",
          "type": "address"
        }
      ],
      "name": "executeIncreaseOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        },
        {
          "internalType": "address payable",
          "name": "_feeReceiver",
          "type": "address"
        }
      ],
      "name": "executeSwapOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        }
      ],
      "name": "getDecreaseOrder",
      "outputs": [
        {
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "collateralDelta",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        }
      ],
      "name": "getIncreaseOrder",
      "outputs": [
        {
          "internalType": "address",
          "name": "purchaseToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "purchaseTokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        }
      ],
      "name": "getSwapOrder",
      "outputs": [
        {
          "internalType": "address",
          "name": "path0",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "path1",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "path2",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "triggerRatio",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "shouldUnwrap",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_otherToken",
          "type": "address"
        }
      ],
      "name": "getUsdgMinPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gov",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "increaseOrders",
      "outputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "purchaseToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "purchaseTokenAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "collateralToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "indexToken",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isLong",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "increaseOrdersIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_router",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_vault",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_weth",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_usdg",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_minExecutionFee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minPurchaseTokenAmountUsd",
          "type": "uint256"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isInitialized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minExecutionFee",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minPurchaseTokenAmountUsd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "router",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_gov",
          "type": "address"
        }
      ],
      "name": "setGov",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minExecutionFee",
          "type": "uint256"
        }
      ],
      "name": "setMinExecutionFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minPurchaseTokenAmountUsd",
          "type": "uint256"
        }
      ],
      "name": "setMinPurchaseTokenAmountUsd",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "swapOrders",
      "outputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amountIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "minOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "triggerRatio",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "shouldUnwrap",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "executionFee",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "swapOrdersIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_collateralDelta",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        }
      ],
      "name": "updateDecreaseOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_sizeDelta",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        }
      ],
      "name": "updateIncreaseOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_orderIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_minOut",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_triggerRatio",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        }
      ],
      "name": "updateSwapOrder",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "usdg",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_triggerAboveThreshold",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_triggerPrice",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_indexToken",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "_maximizePrice",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "_raise",
          "type": "bool"
        }
      ],
      "name": "validatePositionOrderPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_path",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_triggerRatio",
          "type": "uint256"
        }
      ],
      "name": "validateSwapOrderPriceWithTriggerAboveThreshold",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "vault",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "weth",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
  
module.exports = {abi};