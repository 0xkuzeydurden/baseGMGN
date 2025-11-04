// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Mintable is ERC20, Ownable {
    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ERC20(name_, symbol_)
        Ownable(msg.sender)
    {
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
