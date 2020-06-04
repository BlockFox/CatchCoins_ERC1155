const CatchCoinGameToken = artifacts.require("CatchCoinGameToken");

module.exports = function(deployer) {
  deployer.deploy(CatchCoinGameToken);
};
