import { LogDescription } from "@ethersproject/abi";
import { BigNumber, ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";

export const parseEvent = <T>(log: LogDescription) => {
  const result = {} as T;
  for (let i = 0; i < log.eventFragment.inputs.length; i++) {
    const input = log.eventFragment.inputs[i];
    const name = input.name;
    result[name as keyof T] =
      BigNumber.isBigNumber(log.args[name]) && !name.includes("ID")
        ? formatEther(log.args[name])
        : log.args[name].toString();
  }
  return result;
};

export const parseResult = <T>(
  result: { [key: string]: any },
  outputFragment: ethers.utils.ParamType[]
) => {
  outputFragment =
    outputFragment.length == 1 ? outputFragment[0].components : outputFragment;
  const parsedResult: T = {} as T;
  for (let i = 0; i < outputFragment.length; i++) {
    const key = outputFragment[i].name as string;
    parsedResult[key as keyof T] =
      BigNumber.isBigNumber(result[key]) &&
      !key.includes("EndTime") &&
      !key.includes("turnTime")
        ? formatEther(result[key])
        : result[key].toString();
  }
  console.log("🚀 ~ parseResult ~ parsedResult", parsedResult);

  return parsedResult;
};

export const compareAddress = (address1: string, address2: string) => {
  if (!checkIsValidAddress(address1) || !checkIsValidAddress(address2))
    return false;
  return address1.toLowerCase() === address2.toLowerCase();
};

export const checkIsValidAddress = (address: string) => {
  return (
    ethers.utils.isAddress(address) && address !== ethers.constants.AddressZero
  );
};
