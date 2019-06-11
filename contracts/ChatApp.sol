pragma solidity ^0.5.0;

import "tabookey-gasless/contracts/RelayRecipient.sol";
import "zos-lib/contracts/Initializable.sol";

contract ChatApp is RelayRecipient, Initializable{
    
    event message(string message, address user, uint timestamp, bytes32 uuid);

    function postMessage(string memory _msg) public {
        emit message(_msg, get_sender(), now, keccak256(abi.encodePacked(_msg, now, get_sender())));
    }

    function init_hub(RelayHub hub_addr) public {
    init_relay_hub(hub_addr);
    }

    function accept_relayed_call(address /*relay*/, address /*from*/,
    bytes memory/*encoded_function*/, uint /*gas_price*/, 
    uint /*transaction_fee*/ ) public view returns(uint32) {
    return 0; // accept everything.
}
    // nothing to be done post-call.
    // still, we must implement this method.
    function post_relayed_call(address /*relay*/, address /*from*/,
    bytes memory /*encoded_function*/, bool /*success*/,
    uint /*used_gas*/, uint /*transaction_fee*/ ) public {
}
    
}
