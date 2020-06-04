// import Web3 object to interact with wallet provider
// for testing
//the truffle develop provider is used -> Port 9545
// web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

// to interact with metamask change provider to currentProvider
var web3 = new Web3(web3.currentProvider);
var catchCoinTokenContract;
var marketplaceContract;

/* old Contracts
const GameTokenAddress = "0x863D0B5043BD29F0DEDC304eDA9a24b02a94b224";
const MarketplaceAddress = "0x0f69906572A5c9541E7154daADA1A763DB50B87B";
*/
const GameTokenAddress = "0xD390cC9CBA338330e6Ae45b6a54B5883de2A7355";
const MarketplaceAddress = "0xC629b10eC5C3726aF74b71D9407cE75dcACAb7B7";

// Gaming variables
// set screensize static
const WIDTH = 1000;
const HEIGHT = 750;
const GAME_TIME = 60;

// Game variable
var game;
// define Keyboard
var keys;
// define characters and objects
var knight;
var crates;
var background;
var coinTimer; // timer for falling Bitcoins
var coins; // falling Bitcoins

// scores and Timer
var score = 0;
var scoreText;

var secondsLeft = GAME_TIME;
var timeLeftText;
var timeLeftTimer;

var gameOver = false;

 // configure the game
 // --> heigth, with, render-type, game loop function
var config;

var talisman_pumper = 3000; // pump Talisman
var game_second = 1000; // Time Wrap Cape
var player_speed_boost = 300; // activate speed boost with shift



$(document).ready(function() {
  // to enabel accounts (trough metamask) and create Contract instance
  window.ethereum.enable()
  .then(function(accounts)
  {
    catchCoinTokenContract = new web3.eth.Contract(gameTokenAbi, GameTokenAddress);
    marketplaceContract = new web3.eth.Contract(marketplaceAbi, MarketplaceAddress);
    getItems(function(){
      //start Game
      // game= new Phaser.Game(config);
    });
  });

});


function startGame() {
  // open new Window : https://stackoverflow.com/questions/34082002/html-button-opening-link-in-new-tab/46542656
  window.open('./game.html','_blank');

}


// buy Tokens
//info: her I use function() for promise
function buyTokens(id) {
  web3.eth.getAccounts().then(
      function(accounts) {
        //get price
        marketplaceContract.methods.getTokenPrice(id)
        .call({from: accounts[0]})
        .then(price => {
          console.log(price);

          // set options Objekt für purchase
          let options = {
            from: accounts[0],
            value: price
          };
          // buy tokens
          marketplaceContract.methods.buyTokens(id)
          .send(options)
          .on('receipt', receipt => {
              alert("Transaktion complete");
            // update Game vars and ui
            catchCoinTokenContract.methods.balanceOf(accounts[0],id)
            .call()
            .then(val=> {
              console.log(val);
              switch (id)
                {
                  case 1:
                    updateTalisman(val);
                    break;
                  case 2:
                    updateBoost(val);
                    break;
                  case 3:
                  updateTimeCapes(val);
                }
              }); // balanceOf
            }); // buyTokens(id)
        }); // getTokenPrice(id)
      }); // function(accounts)
}

//getPlayer Items
//info: her I use arg=>{} for promise
function getItems(callback) {
  web3.eth.getAccounts().then(accounts => {
    var promises = [];
    promises[1] =catchCoinTokenContract.methods.balanceOf(accounts[0],1).call();
    promises[2] =catchCoinTokenContract.methods.balanceOf(accounts[0],2).call();
    promises[3] =catchCoinTokenContract.methods.balanceOf(accounts[0],3).call();

    Promise.all(promises).then(values => {
       console.log(values);
      // set Game variables

      updateTalisman(values[1]);
      updateBoost(values[2]);
      updateTimeCapes(values[3]);
/*
      var amount_talisman = values[1];
      var amount_boosts = values[2];
      var amount_TimeCapes = values[3];


      if (amount_talisman > 0) {
        talisman_pumper = talisman_pumper * Math.pow(0.85, amount_talisman);
        $("#balance_talisman").text(amount_talisman);
      }
      if (amount_TimeCapes > 0) {
        game_second = game_second * Math.pow(1.2, amount_TimeCapes);
        $("#balance_time_wrap").text(amount_TimeCapes);
      }
      if (amount_boosts >0) {
        player_speed_boost = player_speed_boost * Math.pow(1.2, amount_boosts);
        $("#balance_super_boost").text(amount_boosts);
      }
      */

      // add callbackfunctionality to "pause" Game until variables are set
      // in CatchCoin_main.js first getItems() is called and .then() Game will be created
      callback();
    });
  });
}


function updateTalisman(amount_talisman) {
  if (amount_talisman > 0) {
    talisman_pumper = talisman_pumper * Math.pow(0.85, amount_talisman);
    $("#balance_talisman").text(amount_talisman);
  }
}

function updateTimeCapes(amount_TimeCapes) {
  if (amount_TimeCapes > 0) {
    game_second = game_second * Math.pow(1.2, amount_TimeCapes);
    $("#balance_time_wrap").text(amount_TimeCapes);
  }
}

function updateBoost(amount_boosts){
  if (amount_boosts >0) {
    player_speed_boost = player_speed_boost * Math.pow(1.2, amount_boosts);
    $("#balance_super_boost").text(amount_boosts);
  }
}
