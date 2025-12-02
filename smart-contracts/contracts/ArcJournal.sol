// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ArcJournal {
    event TasksSynced(address indexed user, string[] taskTitles, uint256 timestamp);
    event DocumentAnchored(address indexed user, string docId, string contentHash, uint256 timestamp);
    event PasswordSet(address indexed user, uint256 timestamp);

    struct DocumentLog {
        string docId;
        string contentHash;
        uint256 timestamp;
    }

    // Mapping from user address to array of document logs
    mapping(address => DocumentLog[]) public userDocuments;
    
    // Mapping from user address to password hash
    mapping(address => bytes32) public userPasswordHashes;

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
    
    function setPasswordHash(bytes32 _passwordHash) external {
        require(userPasswordHashes[msg.sender] == bytes32(0), "Password already set");
        userPasswordHashes[msg.sender] = _passwordHash;
        emit PasswordSet(msg.sender, block.timestamp);
    }
    
    function hasPassword(address _user) external view returns (bool) {
        return userPasswordHashes[_user] != bytes32(0);
    }
}
