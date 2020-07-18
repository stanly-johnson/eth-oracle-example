/*
Unit tests for Oracle Contract
*/
var Oracle = artifacts.require('./Oracle.sol');

contract('Oracle', function (accounts) {
  //specify the smart contract test values here
  const $test_item_uid = 1;
  const $test_item_name = 'ODIWC2020';
  const $test_item_winner = 1;

  const $test_item_uid_2 = 3;
  const $test_item_name_2 = 'TSTWC2020';
  const $test_item_winner_2 = 1;
  const $test_contract_owner = accounts[0];

  //test for contract initialisation
  it('Test for Initial Asset', function () {
    return Oracle.deployed()
      .then(function (instance) {
        OracleInstance = instance;
        return OracleInstance.matches($test_item_uid);
      })
      .then(function (_response) {
        assert.equal(_response.name, $test_item_name, 'name has been assigned correctly');
        assert.equal(_response.winner.toNumber(), $test_item_winner, 'Winner has been assigned correctly');
      });
  });

  it('Test for Connection Response', function () {
    return Oracle.deployed()
      .then(function (instance) {
        OracleInstance = instance;
        return OracleInstance.testConnection();
      })
      .then(function (_response) {
        assert.equal(_response, true, 'Connection test works succesfully');
      });
  });

  //test for addMatch function
  it('Test for addMatch function', function () {
    return Oracle.deployed()
      .then(function (instance) {
        OracleInstance = instance;
        return OracleInstance.addMatch.call($test_item_name_2, $test_item_winner_2, {
          from: $test_contract_owner,
        });
      })
      .then(function (_res) {
        assert.equal(_res, true, 'Item create call returns success!');
        //add match from non owner account - test should fail
        return OracleInstance.addMatch($test_item_name_2, $test_item_winner_2, { from: accounts[1] });
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message.indexOf('revert') >= 0, 'error message must have revert');
        // add match from owner account - test should pass
        return OracleInstance.addMatch($test_item_name_2, $test_item_winner_2, { from: $test_contract_owner });
      })
      .then(function (receipt) {
        // verify the details of created item
        return OracleInstance.matches($test_item_uid_2);
      })
      .then(function (_response) {
        assert.equal(_response.name, $test_item_name_2, 'name has been assigned correctly');
        assert.equal(_response.winner.toNumber(), $test_item_winner_2, 'Winner has been assigned correctly');
      });
  });

    //test for addMatch function
    it('Test for isWinner function', function () {
        return Oracle.deployed()
          .then(function (instance) {
            OracleInstance = instance;
            return OracleInstance.isWinner.call($test_item_uid_2, $test_item_winner_2,{
              from: $test_contract_owner,
            });
          })
          .then(function (_res) {
            assert.equal(_res, true, 'Iswinner call returns success!');
            return OracleInstance.isWinner($test_item_uid_2, 3, { from: accounts[1] });
          }).then(function (_response) {
            assert.equal(_response, false, 'Lost bet test passes');
            // test for purchase with higher price
            return OracleInstance.isWinner($test_item_uid_2, $test_item_winner_2, { from: $test_contract_owner });
          }).then(function (_response) {
            assert.equal(_response, true, 'Win bet test passes');
          });
    });

});
