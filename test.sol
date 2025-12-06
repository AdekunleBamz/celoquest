// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SimpleLending
 * @dev A basic lending protocol on Base network
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract SimpleLending {
    IERC20 public token;
    
    address public owner;
    uint256 public interestRate = 5; // 5% annual interest
    
    struct Loan {
        uint256 amount;
        uint256 interestOwed;
        uint256 startTime;
        bool active;
    }
    
    mapping(address => Loan) public loans;
    mapping(address => uint256) public deposits;
    
    event LoanCreated(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount);
    event Deposited(address indexed lender, uint256 amount);
    event Withdrawn(address indexed lender, uint256 amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    constructor(address _token) {
        token = IERC20(_token);
        owner = msg.sender;
    }
    
    /**
     * @dev Deposit tokens into the protocol
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        deposits[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }
    
    /**
     * @dev Withdraw tokens from the protocol
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        
        deposits[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Create a new loan
     */
    function borrow(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(!loans[msg.sender].active, "Existing loan must be repaid");
        require(token.balanceOf(address(this)) >= amount, "Insufficient liquidity");
        
        uint256 interest = (amount * interestRate) / 100;
        
        loans[msg.sender] = Loan({
            amount: amount,
            interestOwed: interest,
            startTime: block.timestamp,
            active: true
        });
        
        require(token.transfer(msg.sender, amount), "Transfer failed");
        emit LoanCreated(msg.sender, amount);
    }
    
    /**
     * @dev Repay a loan with interest
     */
    function repayLoan(uint256 amount) external {
        Loan storage loan = loans[msg.sender];
        require(loan.active, "No active loan");
        
        uint256 totalOwed = loan.amount + loan.interestOwed;
        require(amount == totalOwed, "Must repay full amount with interest");
        
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        loan.active = false;
        emit LoanRepaid(msg.sender, amount);
    }
    
    /**
     * @dev Get loan details for an address
     */
    function getLoan(address borrower) external view returns (Loan memory) {
        return loans[borrower];
    }
    
    /**
     * @dev Get total contract balance
     */
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
    
    /**
     * @dev Update interest rate (owner only)
     */
    function setInterestRate(uint256 _rate) external onlyOwner {
        require(_rate <= 100, "Rate too high");
        interestRate = _rate;
    }
}
