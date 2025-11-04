// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract GMGN {
    uint256 public gmCount;
    uint256 public gnCount;

    event GM(address indexed from, uint256 newCount);
    event GN(address indexed from, uint256 newCount);

    function gm() external {
        gmCount += 1;
        emit GM(msg.sender, gmCount);
    }

    function gn() external {
        gnCount += 1;
        emit GN(msg.sender, gnCount);
    }
}
