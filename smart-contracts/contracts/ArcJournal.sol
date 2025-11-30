// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArcJournal {
    event TasksSynced(address indexed user, string[] taskTitles, uint256 timestamp);
    event DocumentAnchored(address indexed user, string docId, string contentHash, uint256 timestamp);

    struct DocumentLog {
        string docId;
        string contentHash;
        uint256 timestamp;
    }

    // Mapping from user address to array of document logs
    mapping(address => DocumentLog[]) public userDocuments;

    function logTasks(string[] calldata taskTitles) external {
        emit TasksSynced(msg.sender, taskTitles, block.timestamp);
    }

    function anchorDocument(string memory _docId, string memory _contentHash) external {
        userDocuments[msg.sender].push(DocumentLog({
            docId: _docId,
            contentHash: _contentHash,
            timestamp: block.timestamp
        }));
        emit DocumentAnchored(msg.sender, _docId, _contentHash, block.timestamp);
    }
}
