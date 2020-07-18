pragma solidity ^0.5.0;

contract Oracle {

    struct Match {
        string name;
        uint winner;
    }

    mapping(uint => Match) public matches;

    // create a var to store the store owner address
    address payable public owner = address(0x5660df1681a32E70704439E9243b1B91c369580e);

    uint public matchCount;

    event DeclareWinner(uint256 _uid, string winner);

    constructor () public {
        addMatch("ODIWC2020", 1);
    }

    modifier onlyOwner() {
        // ensure the store owner is the msg.sender
        require(msg.sender == owner, "Only owner can create match");
        _;
    }

    function testConnection() public pure returns (bool) {
        return true;
    }

    function addMatch(string memory name, uint256 winner) public onlyOwner returns (bool success) {
        matchCount++;
        matches[matchCount] = Match(name, winner);
        return true;
    }

    function isWinner(uint256 _matchid, uint256 _chosenWinner) public view returns(bool) {
        if(matches[_matchid].winner == _chosenWinner){
            return true;
        } else {
            return false;
        }
    }



}