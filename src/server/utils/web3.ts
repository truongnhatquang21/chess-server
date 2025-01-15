import { ethers } from "ethers";

export const roninProvider = new ethers.providers.JsonRpcProvider(
  process.env.SAIGON_TESTNET_RPC
);
