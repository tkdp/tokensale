pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FixedSupplyToken.sol";

contract TestFixedSupplyToken {

    // FixedSupplyToken token = FixedSupplyToken(DeployedAddresses.FixedSupplyToken());
    FixedSupplyToken token = new FixedSupplyToken();

    function testInitialSupplyUsingDeployedContract() public {
        Assert.equal(token.totalSupply(), 1000000000000000000000000, "Total supply should equal 1000000 tokens");
    }

    function testOwnerInitialBalance() public {
        Assert.equal(token.balanceOf(this), 1000000000000000000000000, "Token owner should have correct initial balance");
    }

    function testTransfer() public {
        token.transfer(address(0), 10);
        Assert.equal(token.balanceOf(address(0)), 10, "After transfer token owner should have 1000000000000000000000000 - 450 token");
        Assert.equal(token.balanceOf(this), 999999999999999999999990, "After transfer token receiver should have 450 token");
    }

    function testApprove() public {
        // the owner gives itself the approvement - only for test purposes 
        Assert.isTrue(token.approve(this, 450), "Token owner can approve transactions");
    }

    function testTransferFrom() public {
        token.transferFrom(this, address(1), 450);  // wie bekomme ich hier die address 1 als sender hin

        Assert.equal(token.balanceOf(this), 999999999999999999999540, "After transfer token owner should have 0 token");
        Assert.equal(token.balanceOf(address(0)), 10, "After transfer token owner should have 0 token");
        Assert.equal(token.balanceOf(address(1)), 450, "After transfer token receiver should have 450 token");
    }



}
