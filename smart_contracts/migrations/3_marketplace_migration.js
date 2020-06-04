const CatchCoinGameToken = artifacts.require("CatchCoinGameToken");
const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  deployer.deploy(Marketplace
    , CatchCoinGameToken.address) // hand over token by address which was already deployed
    .then( () => createToken() )
    .then( () => createToken() )
    .then( () => createToken() )
    .then( () => mintToken(1,10000) )
    .then( () => mintToken(2,10000) )
    .then( () => mintToken(3,10000) );
};

async function createToken() {
    (await CatchCoinGameToken.deployed()).create(0,"");
    // deployed() function gives back the token instance
    // then we can execute contract functions
}

async function mintToken(_id, _quantity) {
  (await CatchCoinGameToken.deployed()).mint(_id, [Marketplace.address], [_quantity]);
}
