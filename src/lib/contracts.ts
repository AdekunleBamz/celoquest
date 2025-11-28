export const MAIN_CONTRACT = process.env.NEXT_PUBLIC_MAIN_CONTRACT as string;
export const APP_CONTRACT = process.env.NEXT_PUBLIC_APP_CONTRACT as string;
export const CUSD_ADDRESS = process.env.NEXT_PUBLIC_CUSD_ADDRESS as string;
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '42220');
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;

export const MAIN_ABI = [
  "function owner() view returns (address)",
  "function borrowerCount() view returns (uint256)",
  "function totalLoansValue() view returns (uint256)",
  "function getName(uint256 _id) view returns (string)",
  "function getLocation(uint256 _id) view returns (string)",
  "function getBusiness(uint256 _id) view returns (string)",
  "function getStory(uint256 _id) view returns (string)",
  "function getPhoto(uint256 _id) view returns (string)",
  "function requestedAmounts(uint256) view returns (uint256)",
  "function fundedAmounts(uint256) view returns (uint256)",
  "function isActive(uint256) view returns (bool)",
  "function isFullyFunded(uint256) view returns (bool)",
  "function stableTokens(uint256) view returns (address)",
  "function totalLent(address) view returns (uint256)",
  "function impactPoints(address) view returns (uint256)",
  "function badgeLevel(address) view returns (uint8)",
  "function getBadgeName(uint8 _b) view returns (string)",
  "function lend(uint256 _id, uint256 _amount)",
  "function claim(uint256 _id)",
  "function addBorrower(string,string,string,string,string,uint256,address)",
  "function toggleActive(uint256 _id)",
  "event LoanProvided(address indexed lender, uint256 indexed id, uint256 amount)",
  "event BorrowerCreated(uint256 indexed id)"
];

export const APP_ABI = [
  "function owner() view returns (address)",
  "function applicationCount() view returns (uint256)",
  "function getName(uint256 _id) view returns (string)",
  "function getEmail(uint256 _id) view returns (string)",
  "function getPhone(uint256 _id) view returns (string)",
  "function getLocation(uint256 _id) view returns (string)",
  "function getBusiness(uint256 _id) view returns (string)",
  "function getStory(uint256 _id) view returns (string)",
  "function getApplicant(uint256 _id) view returns (address)",
  "function getAmount(uint256 _id) view returns (uint256)",
  "function getTimestamp(uint256 _id) view returns (uint256)",
  "function getStatus(uint256 _id) view returns (uint8)",
  "function apply1(string,string,string,string)",
  "function apply2(string,string,uint256)",
  "function approveApplication(uint256 _appId)",
  "function rejectApplication(uint256 _appId)"
];

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)"
];