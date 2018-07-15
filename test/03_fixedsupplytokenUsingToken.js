const Token = artifacts.require("FixedSupplyToken");

/////////////////////////////////////////////////////////////////////////////////
// SUCCESSFULL TEST
// HERE COMPLETE TOKENS ARE USED (=> token * (10**token.decimal)
// RUNS SUCCESSFULLY IN MY ENVIRONMENT
/////////////////////////////////////////////////////////////////////////////////
contract ('fixedSupplyTokenUsingToken', function(accounts) {
    before( async() => {
        owner_account = accounts[0];
        bob_account = accounts[1];
        alice_account = accounts[2];
        token = await Token.deployed();
        decimals = (await token.decimals()).toNumber();
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

    it("it should transfer the correct number of tokens (using token.decimal computation)", async () => {
        let tokenAmount = 50;

        // NUMBERS BEFORE
        let ownerBalanceBefore = (await token.balanceOf(owner_account)) / (10**decimals);
        let bobBalanceBefore = (await token.balanceOf(bob_account)) / (10**decimals);

        // DO THE JOB
        await token.transfer(bob_account, tokenAmount * (10**decimals), {from: owner_account});

        // NUMBERS AFTER
        let ownerBalance = (await token.balanceOf(owner_account)) / (10**decimals);
        let bobBalance = (await token.balanceOf(bob_account)) / (10**decimals);
        assert.equal(ownerBalance, ownerBalanceBefore - tokenAmount, 'owner has incorrect balance');
        assert.equal(bobBalance, bobBalanceBefore + tokenAmount, 'Bob has incorrect balance');
    });

    it("it should allow accounts to approve transfers (using token.decimal computation)", async () => {
        let tokenAmount = 450; 

        await token.approve(bob_account, tokenAmount * (10**decimals), {from: owner_account});
        let allowanceAmount = await token.allowance(owner_account, bob_account);

        assert.equal(allowanceAmount.toNumber(), tokenAmount * (10**decimals), 'Bob has currently an allowance of 450');

    });

    it("it should transferFrom the correct number of tokens (using token.decimal computation)", async () => {
        let tokenAmount = 50;

        // NUMBERS BEFORE
        let ownerBalanceBefore = (await token.balanceOf(owner_account)) / (10**decimals);
        let bobBalanceBefore = await token.balanceOf(bob_account) / (10**decimals);
        let aliceBalanceBefore = await token.balanceOf(alice_account) / (10**decimals);

        // DO THE JOB
        await token.transferFrom(owner_account, alice_account, tokenAmount * (10**decimals), {from: bob_account});

        // NUMBERS AFTER
        let ownerBalance = (await token.balanceOf(owner_account)) / (10**decimals);;
        let bobBalance = await token.balanceOf(bob_account) / (10**decimals);;
        let aliceBalance  = await token.balanceOf(alice_account) / (10**decimals);;
        assert.equal(ownerBalance, ownerBalanceBefore - tokenAmount, 'owner has incorrect balance');
        assert.equal(bobBalance, bobBalanceBefore, 'Bob has incorrect balance');
        assert.equal(aliceBalance, aliceBalanceBefore + tokenAmount, 'Alice has incorrect balance');
     });
});
