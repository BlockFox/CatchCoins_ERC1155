#Catch Coins
A Game where you must catch as many coins as you can. In this version you can purchase some collectibles like
- Pump Talisman: the more you have the more coins fall from the sky
- Super Boost: make your character faster
- Time Wrap Cape: reduce speed of timer

##Acknowledgement
Many thanks to Ivan and Filip for the great course "Ethereum Game Programming" in your academy on "https://academy.ivanontech.com/"

## Requirements
1. Install python

2. MetaMask Brower extension

3. Install Truffle: https://www.trufflesuite.com/docs/truffle/getting-started/installation
    ```
    npm install -g truffle
    ```

### Additional installations
For unit testing truffle-assertions can be very helpful
1. Initialize node package manager fist
    ```
    npm init
    ```
2. Install truffle-assertions
    ```
    npm install truffle-assertions
    ```

##How to Play
1. Download the whole project folder. The smart contracts are deployed on Ropsten NW but you can deploy it on your own with Truffle.

2. Run a local python web server in the user_interface folder with console
    ```
    python -m SimpleHTTPServer
    ```

3. In your browser connect to
    > localhost:8000

4. enjoy ;)

##Further steps
- the ability to sell coins
- the ability to update Contract (proxy contract)
