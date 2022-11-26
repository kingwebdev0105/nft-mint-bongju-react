import { ethers } from "ethers";
import { Interface } from '@ethersproject/abi';
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction, ContractCall } from "@usedapp/core";
import simpleContractAbi from "../abi/CrazyBongContract.json";
import { crazyBongContractAddress } from "../contracts"

const abi: Interface = new Interface(simpleContractAbi);
const carzyBongInterface = new ethers.utils.Interface(simpleContractAbi);

const contract = new Contract(crazyBongContractAddress, carzyBongInterface);
export function useCount() {
  const getTreasury = useContractCall({
    abi,
    address: crazyBongContractAddress,
    method: 'getTreasury',
    args: [],
  });

  const tokenPrice = useContractCall({
    abi,
    address: crazyBongContractAddress,
    method: 'getTokenPrice',
    args: [],
  });
  return tokenPrice;
}

export function useContractMethod(methodName: string) {
  const { state, send } = useContractFunction(contract, methodName, {});
  return { state, send };
}