"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roninProvider = void 0;
const ethers_1 = require("ethers");
exports.roninProvider = new ethers_1.ethers.providers.JsonRpcProvider(process.env.SAIGON_TESTNET_RPC);
