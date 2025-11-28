// IAPIClient.ts
import {
  CollateralTokenType,
  TargetTokenType,
  Trade,
  TradeDirectionEnum,
  TradeStatusEnum,
} from "./types";
import { DeliverTxResponse } from "@sifchain/sdk";

export type TxResult = DeliverTxResponse | { hash: string };

export interface IAPIClient {
  placeOrder(
    tokenType: CollateralTokenType,
    tokenAmount: number,
    targetTokenType: TargetTokenType,
    tradeDirection: TradeDirectionEnum,
    leverage: number,
    stopLoss: number | null,
    takeProfit: number | null,
    limitPrice: number | null
  ): Promise<TxResult | null>;
  closeOrder(tradeId: number): Promise<TxResult | null>;
  cancelOrder(tradeId: number): Promise<TxResult | null>;
  getCurrentInterestRate(targetTokenType: TargetTokenType): Promise<number>;
  getTrades(
    tradeType: TradeDirectionEnum | undefined,
    status: TradeStatusEnum | undefined
  ): Promise<Trade[]>;
  getTrade(tradeId: number): Promise<Trade | null>;
  getTopMatch(
    collateralType: CollateralTokenType,
    collateralTokenAmount: number
  ): Promise<number | null>;
  getPnl(type: string): Promise<{ [key: string]: number }>;
}
