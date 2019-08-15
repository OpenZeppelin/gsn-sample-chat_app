pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";

contract Workshop is GSNRecipient {
    uint public one;
    uint public two;
    uint public three;
    uint public four;

    event optionSelected(uint _option);

    function selectOption(uint _option) public {
        if(_option == 1){
            emit optionSelected(1);
            one += 1;
        }
        if(_option == 2){
            emit optionSelected(1);
            two += 1;
        }
        if(_option == 3){
            emit optionSelected(1);
            three += 1;
        }
        if(_option == 4){
            emit optionSelected(1);
            four += 1;
        }
    }

    function acceptRelayedCall(address relay, address from, bytes calldata encodedFunction, uint256 transactionFee, uint256 gasPrice, uint256 gasLimit, uint256 nonce, bytes calldata approvalData, uint256 maxPossibleCharge
 ) external view returns (uint256, bytes memory) {
  return _approveRelayedCall();
 }
}
