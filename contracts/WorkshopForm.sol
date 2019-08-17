pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";

contract Workshop is GSNRecipient {
    event optionSelected(uint _option, uint indexed _poll_number);

    function selectOption(uint _option, uint _poll_number) public {
        if(_option == 1){
            emit optionSelected(_option, _poll_number);

        }
        if(_option == 2){
            emit optionSelected(_option, _poll_number);

        }
        if(_option == 3){
            emit optionSelected(_option, _poll_number);

        }
        if(_option == 4){
            emit optionSelected(_option, _poll_number);
        }
    }

    function acceptRelayedCall(address relay, address from, bytes calldata encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes calldata approvalData, uint256 maxPossibleCharge
 ) external view returns (uint256, bytes memory) {
        return _approveRelayedCall();
    }

    function getRecipientBalance() public view returns (uint) {
          return IRelayHub(getHubAddr()).balanceOf(address(this));
 }
}
