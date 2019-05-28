pragma solidity ^0.5.0;

import "zos-lib/contracts/Initializable.sol";

contract ChatApp is Initializable {
    
    mapping(uint => string) public idToRoom;
    mapping(uint => bool) public roomExists;
    mapping(bytes32 => uint) public roomRecord;
    
    uint public roomCount;
    
    event message(string message,  uint roomId, string roomName, address user);
    event roomAdded(uint roomId, string room, address user);

    function initialize() initializer public{
        roomCount = 1;

    }
    
    
    function makeRoom(string memory _roomName) public returns(uint256){
        require(roomRecord[keccak256(bytes(_roomName))] == 0, "The room already exists");
        uint roomId = roomCount;
        roomRecord[keccak256(bytes(_roomName))] =  roomId;
        idToRoom[roomId] = _roomName;
        roomExists[roomId] = true;
        emit roomAdded(roomId, idToRoom[roomId], msg.sender);
        roomCount++;
        return roomId;
        
    }
    
    function postMessage(string memory _msg, uint256 _roomId) public {
        require(roomExists[_roomId] == true, "The room does not exist");
        emit message(_msg, _roomId,  idToRoom[_roomId], msg.sender);
    }
    
    
}
