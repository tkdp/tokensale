pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/FixedSupplyToken.sol";

contract TestFixedSupplyToken {

    FixedSupplyToken token = FixedSupplyToken(DeployedAddresses.FixedSupplyToken());

    function testInitialSupplyUsingDeployedContract() public {
        Assert.equal(token.totalSupply(), 1000000000000000000000000, "Total supply should equal 1000000 tokens");
    }

    function testOwnerInitialBalance() public {
        Assert.equal(token.balanceOf(msg.sender), 1000000000000000000000000, "Token owner should have correct initial balance");
    }

    function testTransfer() public {
        token.transfer(address(1), 10); // EVM ERROR or can i specify the {from: ...} here somehow?
        Assert.equal(token.balanceOf(msg.sender), 1, "After transfer token owner should have 1000000000000000000000000 - 450 token");
        Assert.equal(token.balanceOf(address(2)), 2, "After transfer token receiver should have 450 token");
    }

    function testApprove() public {
        Assert.isTrue(token.approve(address(1), 450), "Token owner can approve transactions");
    }

    function testTransferFrom() public {
        token.transferFrom(address(0), address(2), 450);  // wie bekomme ich hier die address 1 als sender hin

        Assert.equal(token.balanceOf(address(1)), 0, "After transfer token owner should have 0 token");
        Assert.equal(token.balanceOf(address(2)), 450, "After transfer token receiver should have 450 token");
    }

}
