pragma solidity ^0.5.0;

contract Oracle {

    //struct to add matchoutcomes
    struct Match {
        string name;
        uint winner;
    }

    mapping(uint => Match) public matches;

    // create a var to store the store owner address
    address payable public owner;

    uint public matchCount;

    constructor () public {
        //set owner
        owner = msg.sender;
        //create matches for testing
        addMatch("ODIWC2020", 1);
        addMatch("T20WC2020", 2);
    }

    modifier onlyOwner() {
        // ensure the store owner is the msg.sender
        require(msg.sender == owner, "Only owner can create match");
        _;
    }

    //function to test connection - return true without checks
    function testConnection() public pure returns (bool) {
        return true;
    }

    //set a new match outcome
    function addMatch(string memory name, uint256 winner) public onlyOwner returns (bool success) {
        matchCount++;
        matches[matchCount] = Match(name, winner);
        return true;
    }

    //return if user prediction is correct
    function isWinner(uint256 _matchid, uint256 _chosenWinner) public view returns(bool) {
        //check if the chosenWinner matched with actual winner
        if(matches[_matchid].winner == _chosenWinner){
            return true;
        } else {
            return false;
        }
    }

//end of oracle contract
}