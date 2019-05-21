pragma solidity >=0.4.22 <0.6.0;
library SafeMath {
  function mul(uint256 _a, uint256 _b) internal pure returns (uint256) {
      if (_a == 0) {
          return 0;
        }
      uint256 c = _a * _b;
      assert(c / _a == _b);
      return c;
  }
  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
      require(_b > 0);
      uint256 c = _a / _b;
      return c;
  }
  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
      assert(_b <= _a);
      uint256 c = _a - _b;
      return c;
  }
  function add(uint256 _a, uint256 _b) internal pure returns (uint256) {
      uint256 c = _a + _b;
      assert(c >= _a);
      return c;
  }
}contract UserData{
    using SafeMath for uint256;


    struct Info{
        address key;
        string data_hash;
    }

    address creator;

    mapping(address=>Info) public user_list;

    modifier onlyCreator{
        require(msg.sender==creator);
        _;
    }

    constructor() public{
    }

    function Input_list(address _key, string memory _data_hash) public{
        user_list[_key].key=_key;
        user_list[_key].data_hash=_data_hash;
    }


    function Show_list(address _key)  public returns(address,string memory){
        return (user_list[_key].key,user_list[_key].data_hash);
    }

}
