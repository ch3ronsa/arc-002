// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskJournal {
    event TasksSynced(address indexed user, string[] taskTitles, uint256 timestamp);

    function logTasks(string[] calldata taskTitles) external {
        emit TasksSynced(msg.sender, taskTitles, block.timestamp);
    }
}
