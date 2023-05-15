// SPDX-License-identifier: GPL-3.0

pragma solidity >=0.5.0 < 0.9.0;

contract vendor
{
    struct Memo
    {
        string name;
        string message;
        uint timestamp;
        address from;
        uint Amount;
    }

    Memo[] memos;
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }

    function buy(string memory name, string memory message) public payable
    {
        require(msg.value>0 , "Please enter Valid Amount ");
        owner.transfer(msg.value);
        memos.push(Memo(name,message,block.timestamp,msg.sender,msg.value));
    }

    function getMemos() public view returns(Memo[] memory)
    {
        return memos;
    }
}