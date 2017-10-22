var exports = module.exports = {};
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');
var SolidityFunction = require("web3/lib/web3/function");
var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/')); // set default web3 provider 

exports.setWeb3Provider = function (provider) { // allow customization of web3 provider 
  web3 = new Web3(new Web3.providers.HttpProvider(provider));
}

exports.setWeb3ToCurrentProvider = function () {
  web3 = new Web3(web3.currentProvider);
}

exports.contractName = function (source) {
  var re1 = /contract.*{/g;
  var re2 = /\s\w+\s/;
  return source.match(re1).pop().match(re2)[0].trim();
}

exports.loadContract = function (path) {
  return fs.readFileSync(path, 'utf8');
}

exports.sendRawTnx = function (source, address, pkey, _callback) {
  var compiled = solc.compile(source);
  var contractName = this.contractName(source);
  var bytecode = compiled.contracts[[`:${contractName}`]]["bytecode"];
  var pkeyx = new Buffer(pkey, 'hex');
  var rawTx = {
    nonce: web3.eth.getTransactionCount(address),
    gasPrice: '0x09184e72a00',
    gasLimit: '0x271000',
    data: '0x' + bytecode
  }
  var tx = new Tx(rawTx);
  tx.sign(pkeyx);
  var serializedTx = tx.serialize().toString('hex');
  web3.eth.sendRawTransaction('0x' + serializedTx, function (err, TnxHash) {
    if (err) {
      _callback(err, null);
    } else {
      var interval = setInterval(function () {
        web3.eth.getTransaction(TnxHash, function (err, result) {
          if (result.transactionIndex != null) {
            web3.eth.getTransactionReceipt(TnxHash, function (err, receipt) {
              if (receipt) {
                var contractAddress = receipt.contractAddress;
                if (contractAddress) {
                  clearInterval(interval);
                  _callback(null, contractAddress);
                }
              }
            });
          }
        });
      }, 2000); // check every 2 sec if the contract has been mined 
    }
  });
}

exports.contractObject = function (source, contractAddress) {
  var compiled = solc.compile(source);
  var contractName = this.contractName(source);
  var bytecode = compiled["contracts"][`:${contractName}`]["bytecode"];
  var abi = JSON.parse(compiled["contracts"][`:${contractName}`]["interface"]);
  var contract = web3.eth.contract(abi);

  return contract.at(contractAddress);
}

exports.etherBalance = function (contract) {
  switch (typeof (contract)) {
    case "object":
      if (contract.address) {
        return web3.fromWei(web3.eth.getBalance(contract.address), 'ether').toNumber();
      } else {
        return new Error("cannot call getEtherBalance on an object that does not have a property 'address'");
      }
      break
    case "string":
      return web3.fromWei(web3.eth.getBalance(contract), 'ether').toNumber();
      break
  }
}


