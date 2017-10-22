var helper = require('./index');
//console.log(helper);
//helper.setWeb3ToCurrentProvider(); // optional, write this if you're connecting to injected web3 like MetaMask or parity

source = "contract test { function hi() public returns (uint256) { return 123; }}";
address = "0xd98e75cc85ae6f7e8bb1b382ebdab27d7e44bc30";
pkey = "609b3129d65126571d2319ce71e257aa76d4b556f8d18d95788a1247dc554436";
helper.sendRawTnx(source, address, pkey, function (err, address) {
    if (!err) {
        var contractAddress = address;
        console.log('contract address:', address);
        var myContract = helper.contractObject(source, contractAddress); // paste the contract address you just get
        console.log('call contract method:', myContract.hi.call().toNumber()); // should print out 123
        var contractBalance = helper.etherBalance(myContract)
        console.log('contract balance:', contractBalance); // should be 0 if no ether is sent to the contract address
    } else console.error(err);

});
