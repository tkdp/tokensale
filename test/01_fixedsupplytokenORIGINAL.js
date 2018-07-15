const Token = artifacts.require("FixedSupplyToken");

contract ('fixedSupplyToken', function(accounts) {
    before(() => {
        owner_account = accounts[0];
        bob_account = accounts[1];
        alice_account = accounts[2];
    });

    it("owner of created token is account[0]", async () => {
        let token = await Token.deployed();
        let real_owner = await token.owner();
        assert.equal(real_owner, owner_account, 'account[0] is not the owner');
    });

    it("it should create  correct total supply", async () => {
        let token = await Token.deployed();
        let supply = await token.totalSupply.call();
        assert.equal(supply.toNumber(), 1000000000000000000000000, 'total supply is wrong');
    });

    it("it should assign all tokens to owner", async () => {
        let token = await Token.deployed();
        let balance = await token.balanceOf.call(accounts[0]);
        assert.equal(balance.toNumber(), 1000000000000000000000000, 'owner has wrong initial balance');
    });

    it("should have the correct name", async () => {
        let token = await Token.deployed();
        let tokenName = await token.name();
        assert.equal(tokenName, 'Example Fixed Supply Token', 'total supply is wrong');
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // QUESTION-1 CLARIFICATION: transfer
    // i have on transfer test using pure decimals and one using token computation with the token.decimal
    // the first one transfers an amount to the recipient but does not reduce the owner amount stuff;
    // the second test case is completely functional
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    it("it should transfer the correct number of tokens (using pure decimals)", async () => {
        let token = await Token.deployed();

        await token.transfer(bob_account, 5000000, {from: owner_account});

        let ownerBalance = await token.balanceOf(owner_account);
        let bobBalance = await token.balanceOf(bob_account);
        // QUESTION-1: why do i have still the same owner balance???
        assert.equal(ownerBalance.toNumber(), 1000000000000000000000000, 'owner has incorrect balance');
        assert.equal(bobBalance.toNumber(), 5000000, 'Bob has incorrect balance');
    });

    it("it should transfer the correct number of tokens (using token.decimal computation)", async () => {
        let token = await Token.deployed();
        let decimals = (await token.decimals()).toNumber();

        // NUMBERS BEFORE
        let ownerBalanceBefore = (await token.balanceOf(owner_account)) / (10**decimals);
        let bobBalanceBefore = (await token.balanceOf(bob_account)) / (10**decimals);
        assert.equal(ownerBalanceBefore, 1000000, 'owner has incorrect balance before');
        assert.equal(bobBalanceBefore, 0.000000000005, 'Bob has incorrect balance before');

        // DO THE JOB
        await token.transfer(bob_account, 50 * (10**decimals), {from: owner_account});

        // NUMBERS AFTER
        let ownerBalance = (await token.balanceOf(owner_account)) / (10**decimals);
        let bobBalance = (await token.balanceOf(bob_account)) / (10**decimals);
        // QUESTION-1: why it is now the correct one
        assert.equal(ownerBalance, 999950, 'owner has incorrect balance');
        // QUESTION-2: i would have expect 50.000000000005 for bob
        assert.equal(bobBalance, 50.000000000004995, 'Bob has incorrect balance');
    });

    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    // QUESTION-1 CLARIFICATION: approve/transferFrom
    // i have on approve/transferFrom test using pure decimals and one using token computation with the token.decimal
    // the first one transfers an amount to the recipient but does not reduce the owner amount stuff;
    // the second test case is completely functional
    ///////////////////////////////////////////////////////////////////////////////////////////////////////

    it("it should allow accounts to approve transfers (using pure decimals)", async () => {
        let token = await Token.deployed();
        
        // DO THE JOB
        await token.approve(bob_account, 5000000, {from: owner_account});
        let allowanceAmount = await token.allowance(owner_account, bob_account);

        assert.equal(allowanceAmount.toNumber(), 5000000, 'Bob has currently an allowance of 450');
    });

    // QUESTION-1: why do i have still the same owner balance???
    it("it should transferFrom the correct number of tokens (using pure decimals)", async () => {
        let token = await Token.deployed();

        // NUMBERS BEFORE
        let ownerBalanceBefore = await token.balanceOf(owner_account);
        let bobBalanceBefore = await token.balanceOf(bob_account);
        let aliceBalanceBefore = await token.balanceOf(alice_account);
        assert.equal(ownerBalanceBefore.toNumber(), 999950000000000000000000, 'owner has incorrect balance before');
        // QUESTION-2: strange: now Bob has the correct amount also in the assert; nothing done before
        assert.equal(bobBalanceBefore.toNumber(), 50000000000005000000, 'Bob has incorrect balance before ');
        assert.equal(aliceBalanceBefore.toNumber(), 0, 'Alice has incorrect balance before');

        // DO THE JOB
        await token.transferFrom(owner_account, alice_account, 5000000, {from: bob_account});

        // NUMBERS AFTER
        let ownerBalance = await token.balanceOf(owner_account);
        let bobBalance = await token.balanceOf(bob_account);
        let aliceBalance = await token.balanceOf(alice_account);
        // QUESTION-1: again nothing happened on the ownerBalance
        assert.equal(ownerBalance.toNumber(), 999950000000000000000000, 'owner has incorrect balance');
        assert.equal(bobBalance.toNumber(), 50000000000005000000, 'Bob has incorrect balance');
        assert.equal(aliceBalance.toNumber(), 5000000, 'Alice has incorrect balance');
     });


     it("it should allow accounts to approve transfers (using token.decimal computation)", async () => {
        let token = await Token.deployed();
        let decimals = (await token.decimals()).toNumber();

        await token.approve(bob_account, 450 * (10**decimals), {from: owner_account});
        let allowanceAmount = await token.allowance(owner_account, bob_account);

        assert.equal(allowanceAmount.toNumber(), 450 * (10**decimals), 'Bob has currently an allowance of 450');

    });

    // QUESTION-1: why do i have still the same owner balance???
    it("it should transferFrom the correct number of tokens (using token.decimal computation)", async () => {
        let token = await Token.deployed();
        let decimals = (await token.decimals()).toNumber();

        // numbers before
        let ownerBalanceBefore = (await token.balanceOf(owner_account)) / (10**decimals);;
        let bobBalanceBefore = await token.balanceOf(bob_account) / (10**decimals);;
        let aliceBalanceBefore = await token.balanceOf(alice_account) / (10**decimals);;
        assert.equal(ownerBalanceBefore, 999950, 'owner has incorrect balance before');
        // QUESTION-2: now we are back to a wrong amount
        assert.equal(bobBalanceBefore, 50.000000000004995, 'Bob has incorrect balance before ');
        assert.equal(aliceBalanceBefore, 0.000000000005, 'Alice has incorrect balance before');

        // DO THE JOB
        await token.transferFrom(owner_account, alice_account, 50 * (10**decimals), {from: bob_account});

        // NUMBERS AFTER
        let ownerBalance = (await token.balanceOf(owner_account)) / (10**decimals);;
        let bobBalance = await token.balanceOf(bob_account) / (10**decimals);;
        let aliceBalance  = await token.balanceOf(alice_account) / (10**decimals);;
        // QUESTION-1: again nothing happened on the ownerBalance
        assert.equal(ownerBalance, 999900, 'owner has incorrect balance');
        // QUESTION-2: same wrong numbers for Alice and Bob
        assert.equal(bobBalance, 50.000000000004995, 'Bob has incorrect balance');
        assert.equal(aliceBalance, 50.000000000004995, 'Alice has incorrect balance');
     });

});
