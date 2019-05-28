pragma solidity ^0.5.0;

contract ChatApp {
    
    event message(string message, address user, uint timestamp);

    function postMessage(string memory _msg) public {
        emit message(_msg, msg.sender, now);
    }
    
}
