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
}contract DeptData{
    using SafeMath for uint256;


    struct Info{
        address key;
        string name;
        uint256 lat;
        uint256 lng;
        string addr;
        mapping(address=>bool) dr_list;
    }

    address creator;

    mapping(address=>Info) public dept_list;
    
    modifier onlyCreator{
        require(msg.sender==creator);
        _;
    }

    constructor() public{

    }

    function Input_list(address _key, string memory _name, uint256 _lat, uint256 _lng, string memory _addr, address _dr_addr) public{
        dept_list[_key].key=_key;
        dept_list[_key].name=_name;
        dept_list[_key].lat=_lat;
        dept_list[_key].lng=_lng;
        dept_list[_key].addr=_addr;
        dept_list[_key].dr_list[_dr_addr]=true;
    }

    function Check_dr_list(address _key,address _dr_addr) public returns (bool){
        return dept_list[_key].dr_list[_dr_addr];
    }

    function Show_list(address _key)  public view returns(string memory,uint256,uint256,string memory){
        return (dept_list[_key].name,dept_list[_key].lat,dept_list[_key].lng,dept_list[_key].addr);
    }

}
