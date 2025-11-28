import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import nullthrows from "nullthrows";
import {
  onCancelTradeRequestAPI,
  onCloseTradeAPI,
  onRequestATradeAPI,
  getPrecisionForToken,
} from "../../apiUtils/apiClientUtils";
import { getTokenRegistryEntry } from "../../apiUtils/apiUtils";
import { ChainAdapter, PlaceTradeRequest, TxResult } from "./types";
import { Trade } from "../../api/types";

export class CosmosChainAdapter implements ChainAdapter {
  chain: "cosmos" = "cosmos";
  private wallet: DirectSecp256k1HdWallet;
  private rpcUrl: string;
  private address: string | null = null;
  private denomCache: { [key: string]: string } = {};

  constructor(wallet: DirectSecp256k1HdWallet, rpcUrl: string) {
    this.wallet = wallet;
    this.rpcUrl = rpcUrl;
  }

  async getAddress(): Promise<string> {
    if (this.address) {
      return this.address;
    }
    this.address = (await this.wallet.getAccounts())[0].address;
    return this.address;
  }

  async getPrecision(tokenType: string): Promise<number> {
    const registryEntry = await getTokenRegistryEntry(
      tokenType,
      nullthrows(this.rpcUrl)
    );
    this.denomCache[tokenType] =
      registryEntry.denom ?? registryEntry.baseDenom ?? tokenType;
    return getPrecisionForToken(registryEntry);
  }

  async placeTrade(request: PlaceTradeRequest): Promise<TxResult | null> {
    const accountAddress = await this.getAddress();
    if (!this.denomCache[request.collateralType]) {
      await this.getPrecision(request.collateralType);
    }
    const txn = await onRequestATradeAPI(
      this.wallet,
      accountAddress,
      this.denomCache[request.collateralType] ?? request.collateralType,
      String(request.collateralAmount),
      {
        target_token_type: request.targetTokenType,
        limit_price:
          request.limitPrice !== null ? String(request.limitPrice) : null,
        trade_direction: String(request.tradeDirection),
        stop_loss:
          request.stopLoss !== null ? String(request.stopLoss) : String(null),
        take_profit:
          request.takeProfit !== null ? String(request.takeProfit) : String(null),
        leverage_quantity: String(request.leverage),
      },
      request.precision,
      this.rpcUrl
    );
    return txn;
  }

  async closeTrade(trade: Trade): Promise<TxResult | null> {
    return onCloseTradeAPI(trade, this.wallet, this.rpcUrl);
  }

  async cancelTrade(trade: Trade): Promise<TxResult | null> {
    return onCancelTradeRequestAPI(trade, this.wallet, this.rpcUrl);
  }
}
