pragma solidity ^0.5.0;

import "./Oracle.sol";

contract Prediction {


    //boxing results oracle
    address internal cricOracleAddr = address(0);
    Oracle internal cricOracle = Oracle(cricOracleAddr);

    //constants
    uint internal minimumBet = 1000000000000;

    // create a var to store the store owner address
    address payable public owner = address(0x5660df1681a32E70704439E9243b1B91c369580e);

    struct Bet {
        address user;
        uint matchId;
        uint amount;
        uint chosenWinner;
        bool rewardPaid;
    }

    //mappings
    mapping(address => Bet) public userBets;

    // Store Items Count
    uint public itemCount;

    constructor () public {
    }

    modifier onlyOwner() {
        // ensure the store owner is the msg.sender
        require(msg.sender == owner, "Only owner can create asset");
        _;
    }

    function setOracleAddress(address _oracleAddress) public onlyOwner returns (bool) {
        cricOracleAddr = _oracleAddress;
        cricOracle = Oracle(cricOracleAddr);
        return cricOracle.testConnection();
    }

    function createBet(uint256 _matchid, uint256 _chosenWinner, uint256 _amount) public payable returns (bool){
        require(msg.value >= minimumBet, "Price Mismatch");
        require(msg.value == _amount, "Price Mismatch");
        userBets[msg.sender] = Bet(msg.sender, _matchid, _amount, _chosenWinner, false);
        return true;
    }

    function withdrawWinning(uint256 _matchid) public returns (bool){
        cricOracle = Oracle(cricOracleAddr);
        bool matchWinner = cricOracle.isWinner(_matchid, userBets[msg.sender].chosenWinner);
        require(matchWinner == true, "Not Winner");
        msg.sender.transfer(address(this).balance);
        return true;
    }


// end of market smart contract
}

