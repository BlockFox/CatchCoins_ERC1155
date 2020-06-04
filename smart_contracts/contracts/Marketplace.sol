pragma solidity ^0.5.0;

import "../lib/IERC1155.sol";
import "../lib/SafeMath.sol";
import "../lib/Common.sol";
import "../lib/IERC1155TokenReceiver.sol";

/*
  TODO: implement following funcitionality:
  - OnlyOwner
  - Proxy
  - possibility to sell tokens to contract
  */


contract Marketplace is ERC1155TokenReceiver, CommonConstants {
  IERC1155 private _token; //token reference to GameToken instance

  using SafeMath for uint256;
        // see doc for libraries:
        // https://solidity.readthedocs.io/en/latest/contracts.html?libraries

  // Keep values from last received contract.
  bool public shouldReject;

  bytes public lastData;
  address public lastOperator;
  address public lastFrom;
  uint256 public lastId;
  uint256 public lastValue;

  //mapping for price of each token item Token_ID => price
  mapping (uint256 => uint256) price;

  constructor (IERC1155 token) public {
    // check if token address is real
    require(address(token) != address(0));
    _token = token;

    //set prices in wei
    price[1] = 100000000000000;
    price[2] = 200000000000000;
    price[3] = 300000000000000;
  }

  // fallback function to buy an item if somebody send money to the contract an no function is specified
  function () external payable {
        buyTokens(0);
    }


  function buyTokens(uint256 tokenId) public payable{
      require(msg.value >= price[tokenId] // enough balance neccessary
        && price[tokenId] != 0);          // token must exist, else price is 0

      // _token.safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
      buyTokens(tokenId, 1);
  }

  function buyTokens(uint256 tokenId, uint256 amount ) public payable{
      // using SafeMath without "using for" declaration
      /*
      uint256 weiAmount = SafeMath.mul(msg.value,amount);
      uint256 tokenPrice = SafeMath.mul(price[tokenId], amount);
      */

      // using SafeMath with "using for" declaration
      uint256 weiAmount = msg.value.mul(amount);
      uint256 tokenPrice = price[tokenId].mul(amount);

      require(weiAmount >= tokenPrice // enough balance neccessary
        && price[tokenId] != 0);          // token must exist, else price is 0

      _token.safeTransferFrom(address(this), msg.sender, tokenId, 1, "");

  }

  function sellTokens(uint tokenId) public{
      // requires more then one token
      // _token.safeTransferFrom(address(this), msg.sender, tokenId, 1, "");
      sellTokens(tokenId, 1);
  }

  function sellTokens(uint256 tokenId, uint256 amount ) public{
    // requires more then amount token
    // balance must sent from marketpalce to user
    //_token.safeTransferFrom(msg.sender,address(this), tokenId, 1, "");
  }

  function getTokenPrice(uint256 tokenId) public view returns (uint256) {
    return price[tokenId];
  }

  function setShouldReject(bool _value) public {
      shouldReject = _value;
  }

  // set compatibility with ERC1155 smart contract
  /*
  function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4){
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

  * better way to implement ist to import
  *  import "./Common.sol";
  *  import "./IERC1155TokenReceiver.sol";
  *  and call function defined in the interface
  */
  function onERC1155Received(address _operator, address _from, uint256 _id,
                              uint256 _value, bytes calldata _data)
  external returns(bytes4)
  {
    lastOperator = _operator;
    lastFrom = _from;
    lastId = _id;
    lastValue = _value;
    lastData = _data;

    if (shouldReject == true) {
        revert("onERC1155Received: transfer not accepted");
    } else {
        return ERC1155_ACCEPTED;
    }
  }

  function onERC1155BatchReceived(address _operator, address _from, uint256[] calldata _ids, uint256[] calldata _values, bytes calldata _data) external returns(bytes4) {
      lastOperator = _operator;
      lastFrom = _from;
      lastId = _ids[0];
      lastValue = _values[0];
      lastData = _data;
      if (shouldReject == true) {
          revert("onERC1155BatchReceived: transfer not accepted");
      } else {
          return ERC1155_BATCH_ACCEPTED;
      }
  }

  // ERC165 interface support
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
      return  interfaceID == 0x01ffc9a7 ||    // ERC165
              interfaceID == 0x4e2312e0;      // ERC1155_ACCEPTED ^ ERC1155_BATCH_ACCEPTED;
  }


}
