import { DeliverTxResponse } from "@sifchain/sdk";
import {
  CollateralTokenType,
  TargetTokenType,
  Trade,
  TradeDirectionEnum,
} from "../../api/types";

export type Chain = "cosmos" | "base";

export type TxResult = DeliverTxResponse | { hash: string };

export type PlaceTradeRequest = {
  collateralType: CollateralTokenType;
  collateralAmount: number;
  targetTokenType: TargetTokenType;
  tradeDirection: TradeDirectionEnum;
  leverage: number;
  stopLoss: number | null;
  takeProfit: number | null;
  limitPrice: number | null;
  precision: number;
};

export interface ChainAdapter {
  chain: Chain;
  getAddress(): Promise<string>;
  getPrecision(tokenType: string): Promise<number>;
  placeTrade(request: PlaceTradeRequest): Promise<TxResult | null>;
  closeTrade(trade: Trade): Promise<TxResult | null>;
  cancelTrade(trade: Trade): Promise<TxResult | null>;
}
