const Token = artifacts.require("FixedSupplyToken");

/////////////////////////////////////////////////////////////////////////////////
// SUCCESSFULL TEST in the ORDER
// 1. transfer with token (tokenAmount * (10**token.decimals))
// 2. transfer with pure decimals
// TEST RUNS SUCCESSFULLY IN MY ENVIRONMENT
/////////////////////////////////////////////////////////////////////////////////
contract ('fixedSupplyTokenMixedNOK', function(accounts) {
    before( async() => {
        owner_account = accounts[0];
        bob_account = accounts[1];
        alice_account = accounts[2];
        token = await Token.deployed();
        decimals = (await token.decimals()).toNumber();
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

});