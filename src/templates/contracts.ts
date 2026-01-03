import { SmartContractTemplate } from '../../types';

/**
 * Smart Contract Templates Optimized for Base
 * Minimal, practical contracts for fast MVP launches
 */
export const contractTemplates: SmartContractTemplate[] = [
  {
    id: 'erc20-basic',
    name: 'ERC20 Token',
    description: 'Simple fungible token with mint and burn capabilities',
    category: 'token',
    baseOptimized: true,
    deploymentParams: [
      { name: 'name', type: 'string', description: 'Token name (e.g., "Base Token")' },
      { name: 'symbol', type: 'string', description: 'Token symbol (e.g., "BASE")' },
      { name: 'initialSupply', type: 'uint256', description: 'Initial supply in tokens' },
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}`,
  },
  {
    id: 'erc721-nft',
    name: 'NFT Collection',
    description: 'Basic NFT collection with metadata URIs',
    category: 'nft',
    baseOptimized: true,
    deploymentParams: [
      { name: 'name', type: 'string', description: 'Collection name' },
      { name: 'symbol', type: 'string', description: 'Collection symbol' },
      { name: 'baseURI', type: 'string', description: 'Base metadata URI' },
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    string private _baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseURI;
    }

    function mint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function batchMint(address to, uint256 quantity) public onlyOwner {
        for (uint256 i = 0; i < quantity; i++) {
            mint(to);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}`,
  },
  {
    id: 'simple-defi',
    name: 'Simple Staking Pool',
    description: 'Minimal staking contract with rewards',
    category: 'defi',
    baseOptimized: true,
    deploymentParams: [
      { name: 'stakingToken', type: 'address', description: 'Token to stake' },
      { name: 'rewardRate', type: 'uint256', description: 'Rewards per second (wei)' },
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleStaking is Ownable {
    IERC20 public stakingToken;
    uint256 public rewardRate;
    
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastStakeTime;
    mapping(address => uint256) public rewards;

    constructor(address _stakingToken, uint256 _rewardRate) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
        rewardRate = _rewardRate;
    }

    function stake(uint256 amount) external {
        updateReward(msg.sender);
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        lastStakeTime[msg.sender] = block.timestamp;
    }

    function unstake(uint256 amount) external {
        require(stakedBalance[msg.sender] >= amount, "Insufficient balance");
        updateReward(msg.sender);
        stakedBalance[msg.sender] -= amount;
        stakingToken.transfer(msg.sender, amount);
    }

    function claimRewards() external {
        updateReward(msg.sender);
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        stakingToken.transfer(msg.sender, reward);
    }

    function updateReward(address account) internal {
        if (stakedBalance[account] > 0) {
            uint256 timeElapsed = block.timestamp - lastStakeTime[account];
            rewards[account] += (stakedBalance[account] * rewardRate * timeElapsed) / 1e18;
            lastStakeTime[account] = block.timestamp;
        }
    }

    function pendingRewards(address account) external view returns (uint256) {
        uint256 timeElapsed = block.timestamp - lastStakeTime[account];
        return rewards[account] + (stakedBalance[account] * rewardRate * timeElapsed) / 1e18;
    }
}`,
  },
  {
    id: 'simple-dao',
    name: 'Simple DAO',
    description: 'Minimal governance contract with proposals and voting',
    category: 'dao',
    baseOptimized: true,
    deploymentParams: [
      { name: 'votingPeriod', type: 'uint256', description: 'Voting period in blocks' },
    ],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleDAO {
    struct Proposal {
        string description;
        uint256 voteCount;
        uint256 deadline;
        bool executed;
        address proposer;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public votingPeriod;
    
    mapping(address => uint256) public votingPower;
    address public admin;

    event ProposalCreated(uint256 proposalId, string description, address proposer);
    event Voted(uint256 proposalId, address voter);
    event ProposalExecuted(uint256 proposalId);

    constructor(uint256 _votingPeriod) {
        votingPeriod = _votingPeriod;
        admin = msg.sender;
        votingPower[msg.sender] = 1;
    }

    function grantVotingPower(address voter) external {
        require(msg.sender == admin, "Only admin");
        votingPower[voter] = 1;
    }

    function createProposal(string memory description) external returns (uint256) {
        require(votingPower[msg.sender] > 0, "No voting power");
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        proposal.description = description;
        proposal.deadline = block.number + votingPeriod;
        proposal.proposer = msg.sender;
        
        emit ProposalCreated(proposalId, description, msg.sender);
        return proposalId;
    }

    function vote(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.number < proposal.deadline, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(votingPower[msg.sender] > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteCount += votingPower[msg.sender];
        
        emit Voted(proposalId, msg.sender);
    }

    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.number >= proposal.deadline, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(proposal.voteCount > 0, "No votes");
        
        proposal.executed = true;
        emit ProposalExecuted(proposalId);
    }
}`,
  },
  {
    id: 'escrow',
    name: 'Simple Escrow',
    description: 'Basic escrow contract for secure transactions',
    category: 'utility',
    baseOptimized: true,
    deploymentParams: [],
    contractCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleEscrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE, REFUNDED }

    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        State state;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;

    event EscrowCreated(uint256 escrowId, address buyer, address seller, uint256 amount);
    event PaymentDeposited(uint256 escrowId);
    event DeliveryConfirmed(uint256 escrowId);
    event Refunded(uint256 escrowId);

    function createEscrow(address seller) external payable returns (uint256) {
        require(msg.value > 0, "Must send ETH");
        
        uint256 escrowId = escrowCount++;
        escrows[escrowId] = Escrow({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            state: State.AWAITING_DELIVERY
        });
        
        emit EscrowCreated(escrowId, msg.sender, seller, msg.value);
        return escrowId;
    }

    function confirmDelivery(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.buyer, "Only buyer");
        require(escrow.state == State.AWAITING_DELIVERY, "Invalid state");
        
        escrow.state = State.COMPLETE;
        payable(escrow.seller).transfer(escrow.amount);
        
        emit DeliveryConfirmed(escrowId);
    }

    function refund(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.seller, "Only seller");
        require(escrow.state == State.AWAITING_DELIVERY, "Invalid state");
        
        escrow.state = State.REFUNDED;
        payable(escrow.buyer).transfer(escrow.amount);
        
        emit Refunded(escrowId);
    }
}`,
  },
];
