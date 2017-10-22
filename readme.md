# Overview
This module can be used to deploy smart contracts on any networks (ex. testnets, private net). Your wallet address and public key is needed to sign the transactions of contract creation. The default network connected is rinkeby testnet, but you can always change it as you wish by the `setWeb3Provider(your_provider)` and `setWeb3ToCurrentProvider()` function (listed below).

# Sample Use Case 
```js
var helper = require('deploy_smart_contract');
helper.setWeb3ToCurrentProvider(); // optional, write this if you're connecting to injected web3 like MetaMask or parity

source = "contract test { function hi() public returns (uint256) { return 123; }}"
address = "your_account_address"
pkey = "your_private_key"
var contractAddress = helper.sendRawTnx(source, address, pkey); // TBC
var myContract = helper.contractObject(source, contractAddress); // paste the contract address you just get
console.log(myContract.hi.call().toNumber()); // should print out 123
var contractBalance = helper.etherBalance(myContract) 
console.log(contractBalance); // should be 0 if no ether is sent to the contract address

```
In the second line, run `helper.setWeb3Provider('your_provider')` instead if you want to specify other provider<br>
If no web3 provider is defined, the default is the rinkeby infura endpoint(your smart contract will be deployed onto the rinkeby testnet)<br>
If you are using the rinkeby testnet, feel free to go to `https://rinkeby.etherscan.io/address/<your_account_address>` to see the transactions' status 

# List of available functions
1. `contractName(source)`: return the contract name from contract source code
2. `loadContract(path)`: return the source code in contract file (ex. myContract.sol)
3. `sendRawTnx(source, address, pkey)`: given the contract source code, address to sign transaction, and private key string, create the contract object and deploy it onto the blockchain. After the contract is mined, it will return the contract address. <br>
Note: The contract mining status is checked every 5 seconds.
4. `contractObject(source, contractAddress)`: return a contrat object to interact with the contract once it is deployed onto the blockchain  
5. `etherBalance(contract)`: return the ether amount in the specified smart contract

# Dependencies version
1. ethereumjs-tx: ^1.3.3
2. fs: 0.0.1-security
3. solc: ^0.4.15
5. web3: 0.20.1 (the newest version is too unstable)