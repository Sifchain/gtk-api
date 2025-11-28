import {
  BASE_CHAIN_CONFIGS,
  BASE_TOKEN_ADDRESSES,
  DEFAULT_BASE_DECIMALS,
} from "../../apiUtils/constants";
import { Trade, TradeDirectionEnum } from "../../api/types";
import { ChainAdapter, PlaceTradeRequest, TxResult } from "./types";
import { Wallet, Contract, JsonRpcProvider, parseUnits } from "ethers";

const ERC20_ABI = ["function decimals() view returns (uint8)"];

export class BaseChainAdapter implements ChainAdapter {
  chain: "base" = "base";
  private wallet: Wallet;
  private network: "mainnet" | "testnet";

  constructor(wallet: Wallet, network: "mainnet" | "testnet") {
    this.wallet = wallet;
    this.network = network;
  }

  async getAddress(): Promise<string> {
    return this.wallet.address;
  }

  async getPrecision(tokenType: string): Promise<number> {
    const tokenAddress =
      BASE_TOKEN_ADDRESSES[this.network][tokenType] ??
      BASE_TOKEN_ADDRESSES.mainnet[tokenType] ??
      "";
    if (!tokenAddress) {
      return DEFAULT_BASE_DECIMALS[tokenType] ?? 18;
    }
    try {
      const provider =
        this.wallet.provider ??
        new JsonRpcProvider(
          BASE_CHAIN_CONFIGS[this.network].rpcUrl,
          BASE_CHAIN_CONFIGS[this.network].chainId
        );
      const erc20 = new Contract(tokenAddress, ERC20_ABI, provider);
      const decimals: number = await erc20.decimals();
      return decimals;
    } catch (error) {
      console.log(
        `Falling back to default decimals for ${tokenType}: ${(error as Error).message}`
      );
      return DEFAULT_BASE_DECIMALS[tokenType] ?? 18;
    }
  }

  private getContract(): Contract {
    if (!BASE_CHAIN_CONFIGS[this.network].tradeContractAddress) {
      throw new Error("BASE_TRADE_CONTRACT_ADDRESS is not set");
    }
    const provider =
      this.wallet.provider ??
      new JsonRpcProvider(
        BASE_CHAIN_CONFIGS[this.network].rpcUrl,
        BASE_CHAIN_CONFIGS[this.network].chainId
      );
    const signer = this.wallet.connect(provider);
    return new Contract(
      BASE_CHAIN_CONFIGS[this.network].tradeContractAddress,
      BASE_CHAIN_CONFIGS[this.network].tradeContractAbi,
      signer
    );
  }

  async placeTrade(request: PlaceTradeRequest): Promise<TxResult | null> {
    const contract = this.getContract();
    const collateralAddress =
      BASE_TOKEN_ADDRESSES[this.network][request.collateralType] ??
      BASE_TOKEN_ADDRESSES.mainnet[request.collateralType] ??
      "";
    if (!collateralAddress) {
      throw new Error(
        `Missing Base collateral address for ${request.collateralType}`
      );
    }
    const tradeDirectionFlag =
      request.tradeDirection === TradeDirectionEnum.LONG ? 1 : 0;
    const amount = parseUnits(
      request.collateralAmount.toString(),
      request.precision
    );
    const tx = await contract.openTrade(
      collateralAddress,
      amount,
      request.targetTokenType,
      tradeDirectionFlag,
      request.leverage,
      request.stopLoss ?? 0,
      request.takeProfit ?? 0,
      request.limitPrice ?? 0
    );
    return { hash: tx.hash };
  }

  async closeTrade(trade: Trade): Promise<TxResult | null> {
    const contract = this.getContract();
    const tx = await contract.closeTrade(trade.id);
    return { hash: tx.hash };
  }

  async cancelTrade(trade: Trade): Promise<TxResult | null> {
    const contract = this.getContract();
    const tx = await contract.cancelTrade(trade.id);
    return { hash: tx.hash };
  }
}
