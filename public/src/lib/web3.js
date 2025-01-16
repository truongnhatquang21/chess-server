"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidAddress = exports.compareAddress = exports.parseResult = exports.parseEvent = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
const parseEvent = (log) => {
    const result = {};
    for (let i = 0; i < log.eventFragment.inputs.length; i++) {
        const input = log.eventFragment.inputs[i];
        const name = input.name;
        result[name] =
            ethers_1.BigNumber.isBigNumber(log.args[name]) && !name.includes("ID")
                ? (0, utils_1.formatEther)(log.args[name])
                : log.args[name].toString();
    }
    return result;
};
exports.parseEvent = parseEvent;
const parseResult = (result, outputFragment) => {
    outputFragment =
        outputFragment.length == 1 ? outputFragment[0].components : outputFragment;
    const parsedResult = {};
    for (let i = 0; i < outputFragment.length; i++) {
        const key = outputFragment[i].name;
        parsedResult[key] =
            ethers_1.BigNumber.isBigNumber(result[key]) &&
                !key.includes("EndTime") &&
                !key.includes("turnTime")
                ? (0, utils_1.formatEther)(result[key])
                : result[key].toString();
    }
    console.log("🚀 ~ parseResult ~ parsedResult", parsedResult);
    return parsedResult;
};
exports.parseResult = parseResult;
const compareAddress = (address1, address2) => {
    if (!(0, exports.checkIsValidAddress)(address1) || !(0, exports.checkIsValidAddress)(address2))
        return false;
    return address1.toLowerCase() === address2.toLowerCase();
};
exports.compareAddress = compareAddress;
const checkIsValidAddress = (address) => {
    return (ethers_1.ethers.utils.isAddress(address) && address !== ethers_1.ethers.constants.AddressZero);
};
exports.checkIsValidAddress = checkIsValidAddress;
