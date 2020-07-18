/*
Unit tests for Decentralised MarketPlace contract
*/
var Prediction = artifacts.require('./Prediction.sol');
var Oracle = artifacts.require('./Oracle.sol');

contract('Prediction', function (accounts) {
  //specify the smart contract test values here
  const $test_item_matchid = 1;
  const $test_item_chosen_winner = 1;
  const $test_item_amount = 1000000000000;
  const $test_contract_owner = accounts[0];

  //test for createBet function
  it('Test for createBet function', function () {
    return Prediction.deployed()
      .then(function (instance) {
        PredictionInstance = instance;
        return PredictionInstance.createBet.call($test_item_matchid, $test_item_chosen_winner, $test_item_amount, {
          from: $test_contract_owner,
        });
      })
      .then(function (_res) {
        assert.equal(_res, true, 'create bet call returns success!');
        return PredictionInstance.createBet($test_item_matchid, $test_item_chosen_winner, $test_item_amount, {
            from: accounts[0],
        });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // test for purchase with higher price
        return PredictionInstance.createBet($test_item_matchid, $test_item_chosen_winner, $test_item_amount, {
            from: accounts[0], value : 1000000000000
        });
      })
      .then(function (receipt) {
        // verify the details of created item
        return PredictionInstance.userBets(accounts[0]);
      })
      .then(function (_response) {
        assert.equal(_response.user, accounts[0], 'user has been assigned correctly');
        assert.equal(_response.matchId.toNumber(), $test_item_matchid, 'matchid has been assigned correctly');
        assert.equal(_response.amount.toNumber(), $test_item_amount, 'amount has been assigned correctly');
        assert.equal(_response.chosenWinner.toNumber(), $test_item_chosen_winner, 'chosenWinner has been assigned correctly');
        assert.equal(_response.rewardPaid, false, 'reward has been assigned correctly');
      });
  });

  //test for setOracleAddress function
  it('Test for setOracleAddress function', function () {
    return Oracle.deployed()
      .then(function (instance) {
        OracleInstance = instance;
        return Prediction.deployed()
      }).then(function (instance) {
        PredictionInstance = instance;
        return PredictionInstance.setOracleAddress.call("0x5461DBF5543f30A4A1B10E1ea9C0ABc883F2ae06", { from : accounts[3]})
      }).then(function (_res) {
        assert.equal(_res, true, 'set oracle address call returns success!');
        return PredictionInstance.setOracleAddress("0x5461DBF5543f30A4A1B10E1ea9C0ABc883F2ae06", {
            from: accounts[2],
        });
      }).catch(function (error) {
        //console.log(error)
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // test for purchase with higher price
        return PredictionInstance.setOracleAddress("0x5461DBF5543f30A4A1B10E1ea9C0ABc883F2ae06", {
            from: accounts[0],
        });
      }).then(function (_res) {
      });
  });

  //test for withdrawWinning function


});
