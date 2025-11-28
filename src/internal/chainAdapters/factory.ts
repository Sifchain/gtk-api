import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { Wallet } from "ethers";
import { Chain, ChainAdapter } from "./types";
import { CosmosChainAdapter } from "./cosmosAdapter";
import { BaseChainAdapter } from "./baseAdapter";
import { SIF_RPC_URLS } from "../../apiUtils/constants";

type AdapterFactory = (
  wallet: DirectSecp256k1HdWallet | Wallet,
  network: "mainnet" | "testnet"
) => ChainAdapter;

const adapterFactories: Record<Chain, AdapterFactory> = {
  cosmos: (wallet, network) =>
    new CosmosChainAdapter(
      wallet as DirectSecp256k1HdWallet,
      SIF_RPC_URLS[network]
    ),
  base: (wallet, network) => new BaseChainAdapter(wallet as Wallet, network),
};

export function createChainAdapter(
  wallet: DirectSecp256k1HdWallet | Wallet,
  chain: Chain,
  network: "mainnet" | "testnet"
): ChainAdapter {
  const factory = adapterFactories[chain];
  if (!factory) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  return factory(wallet, network);
}
