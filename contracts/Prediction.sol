pragma solidity ^0.5.0;

// import the Oracle smart contract instance
import "./Oracle.sol";

contract Prediction {
    //cricket results oracle
    address internal cricOracleAddr = address(0);
    Oracle internal cricOracle = Oracle(cricOracleAddr);

    //constants
    uint internal minimumBet = 1000000000000;

    //struct to store Bet
    struct Bet {
        address user;
        uint matchId;
        uint amount;
        uint chosenWinner;
        bool rewardPaid;
    }

    //mappings
    mapping(address => Bet) public userBets;

    //store owner address
    address payable public owner;

    constructor () public {
        // assign the contract owner
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // ensure the store owner is the msg.sender
        require(msg.sender == owner, "Only owner can create asset");
        _;
    }

    //function to set the oracle address -- only callable by the owner
    function setOracleAddress(address _oracleAddress) public onlyOwner returns (bool) {
        cricOracleAddr = _oracleAddress;
        cricOracle = Oracle(cricOracleAddr);
        return cricOracle.testConnection();
    }

    //function to create a new bet
    function createBet(uint256 _matchid, uint256 _chosenWinner, uint256 _amount) public payable returns (bool){
        //check for minimumBet amount
        require(msg.value >= minimumBet, "Price Mismatch");
        //check for amount
        require(msg.value == _amount, "Price Mismatch");
        //create Bet
        userBets[msg.sender] = Bet(msg.sender, _matchid, _amount, _chosenWinner, false);
        return true;
    }

    //function to withdrawWinning from pool
    function withdrawWinning(uint256 _matchid) public returns (bool){
        //init oracle
        cricOracle = Oracle(cricOracleAddr);
        //call oracle to find if user prediction is right
        bool matchWinner = cricOracle.isWinner(_matchid, userBets[msg.sender].chosenWinner);
        //reject if user prediction is wrong
        require(matchWinner == true, "Not Winner");
        //reject if user already withdrew rewards
        require(userBets[msg.sender].rewardPaid == false, "Reward Paid");
        //set reward paid to true
        userBets[msg.sender].rewardPaid = true;
        //send amount to user
        msg.sender.transfer(address(this).balance);
        return true;
    }

// end of prediction smart contract
}

