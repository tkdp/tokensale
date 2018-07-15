const Token = artifacts.require("FixedSupplyToken");

/////////////////////////////////////////////////////////////////////////////////
// SUCCESSFULL TEST
// HERE ONLY NUMBERS ARE USED REPRESENTING PARTS OF TOKENS (=> PURE DECIMALS)
// RUNS SUCCESSFULLY IN MY ENVIRONMENT
/////////////////////////////////////////////////////////////////////////////////
contract ('fixedSupplyTokenUsingPureDecimal', function(accounts) {
    before( async() => {
        owner_account = accounts[0];
        bob_account = accounts[1];
        alice_account = accounts[2];
        token = await Token.deployed();
    });

    it("owner of created token is account[0]", async () => {
        let real_owner = await token.owner();
        assert.equal(real_owner, owner_account, 'account[0] is not the owner');
    });

    it("it should create  correct total supply", async () => {
        let supply = await token.totalSupply.call();
        assert.equal(supply.toNumber(), 1000000000000000000000000, 'total supply is wrong');
    });

    it("it should assign all tokens to owner", async () => {
        let balance = await token.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 1000000000000000000000000, 'owner has wrong initial balance');
    });

    it("should have the correct name", async () => {
        let tokenName = await token.name();
        assert.equal(tokenName, 'Example Fixed Supply Token', 'total supply is wrong');
    });

    it("it should transfer the correct number of tokens (using pure decimals)", async () => {

        let decimalAmount = 5000000; 

        // NUMBERS BEFORE
        let ownerBalanceBefore = await token.balanceOf(owner_account);
        let bobBalanceBefore = await token.balanceOf(bob_account);

        await token.transfer(bob_account, decimalAmount, {from: owner_account});

        let ownerBalance = await token.balanceOf(owner_account);
        let bobBalance = await token.balanceOf(bob_account);  
        assert.equal(ownerBalance.toNumber(), ownerBalanceBefore.toNumber() - decimalAmount, 'owner has incorrect balance');
        assert.equal(bobBalance.toNumber(), bobBalanceBefore.toNumber() + decimalAmount, 'Bob has incorrect balance');
    });

    it("it should allow accounts to approve transfers (using pure decimals)", async () => {
        let decimalAmount = 5000000

        // DO THE JOB
        await token.approve(bob_account, decimalAmount, {from: owner_account});
        let allowanceAmount = await token.allowance(owner_account, bob_account);

        assert.equal(allowanceAmount.toNumber(), decimalAmount, 'Bob has currently an allowance of 450');
    });

    it("it should transferFrom the correct number of tokens (using pure decimals)", async () => {
        let decimalAmount = 5000000;

        // NUMBERS BEFORE
        let ownerBalanceBefore = await token.balanceOf(owner_account);
        let bobBalanceBefore = await token.balanceOf(bob_account);
        let aliceBalanceBefore = await token.balanceOf(alice_account);

        // DO THE JOB
        await token.transferFrom(owner_account, alice_account, decimalAmount, {from: bob_account});

        // NUMBERS AFTER
        let ownerBalance = await token.balanceOf(owner_account);
        let bobBalance = await token.balanceOf(bob_account);
        let aliceBalance = await token.balanceOf(alice_account);
        assert.equal(ownerBalance.toNumber(), ownerBalanceBefore - decimalAmount, 'owner has incorrect balance');
        assert.equal(bobBalance.toNumber(), bobBalanceBefore, 'Bob has incorrect balance');
        assert.equal(aliceBalance.toNumber(), aliceBalanceBefore + decimalAmount, 'Alice has incorrect balance');
     });
});
