pragma solidity ^0.5.0;

import "tabookey-gasless/contracts/GsnUtils.sol";
import "tabookey-gasless/contracts/IRelayHub.sol";
import "tabookey-gasless/contracts/RelayRecipient.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";

contract ChatApp is RelayRecipient, Ownable {
    using ECDSA for bytes32;

    event message(string message, address user, uint timestamp, bytes32 uuid);

    function postMessage(string memory _msg) public {
        emit message(_msg, getSender(), now, keccak256(abi.encodePacked(_msg, now, getSender())));
    }

    mapping (address => bool) public relaysWhitelist;

    function init(IRelayHub rhub) public initializer {
        setRelayHub(rhub);
    }

    function deposit() public payable {
        getRelayHub().depositFor.value(msg.value)(address(this));
    }

    function withdraw() public onlyOwner {
        uint256 balance = withdrawAllBalance();
        msg.sender.transfer(balance);
    }

    function() external payable {}

    function acceptRelayedCall(address relay, address from, bytes calldata encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes calldata approvalData, uint256 maxPossibleCharge) external view returns (uint256, bytes memory) {
        return (0, "");
    }

    function preRelayedCall(bytes calldata context) /*relayHubOnly*/ external returns (bytes32) {
        return bytes32(uint(123456));
    }

    function postRelayedCall(bytes calldata context, bool success, uint actualCharge, bytes32 preRetVal) /*relayHubOnly*/ external {
    }

    function withdrawAllBalance() private returns (uint256) {
        uint256 balance = getRelayHub().balanceOf(address(this));
        getRelayHub().withdraw(balance);
        return balance;
    }

    function getbal() public returns (uint256){
        return getRelayHub().balanceOf(address(this));
    }
}
