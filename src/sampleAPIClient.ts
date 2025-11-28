// import {
//   APIClientWrapper,
//   PnlTypeEnum,
//   TradeDirectionEnum,
//   TradeStatusEnum,
//   TargetTokenType,
//   CollateralTokenType,
//   DirectSecp256k1HdWallet,
// } from "@sifchain/gtk-api";
// import { JsonRpcProvider, Wallet } from "ethers";

export async function main() {
  // // Initialize the APIClientWrapper
  // const network = "mainnet"; // Replace with the appropriate network
  // const wallet: DirectSecp256k1HdWallet =
  //   await DirectSecp256k1HdWallet.fromMnemonic(
  //     "mnemonic", // Replace with the appropriate mnemonic
  //     {
  //       prefix: "sif",
  //     }
  //   );
  // const client = await APIClientWrapper.create(wallet, network);
  // console.log("APIClientWrapper:", client);
  // // Call placeOrder method
  // const trade = await client.placeOrder(
  //   "uusdc", // collateralTokenType
  //   0.01, // tokenAmount
  //   "btc", // targetTokenType
  //   TradeDirectionEnum.LONG, // tradeDirection
  //   2, // leverage
  //   45000, // stopLoss or null
  //   70000, // takeProfit or null
  //   null // limit_price
  // );
  // console.log("Place Order:", trade);
  // // Call closeOrder method
  // const closedTrade = await client.closeOrder(1615); // Use a mock orderId
  // console.log("Close Order:", closedTrade);
  // // Call cancelOrder method
  // const cancelledTrade = await client.cancelOrder(1615); // Use a mock orderId
  // console.log("Cancel Order:", cancelledTrade);
  // // Call getCurrentInterestRate method
  // const interestRate = await client.getCurrentInterestRate("btc");
  // console.log("Current Interest Rate:", interestRate);
  // // Call getTrades method
  // const trades = await client.getTrades(
  //   TradeDirectionEnum.LONG, // tradeType
  //   TradeStatusEnum.ACTIVE // status
  // );
  // console.log("Get Trades:", trades);
  // // Call getTrade method
  // const tradeDetails = await client.getTrade(123); // Use a mock tradeId
  // console.log("Get Trade:", tradeDetails);
  // // Call getTopMatch method
  // const topMatch = await client.getTopMatch("uusdc", 10);
  // console.log("Top Match:", topMatch);
  // // Call getPnl method
  // const pnl = await client.getPnl(PnlTypeEnum.REALIZED);
  // console.log("PnL:", pnl);

  // // Base network example (requires Base RPC, contract, and addresses to be configured)
  // const provider = new JsonRpcProvider(
  //   process.env.BASE_RPC_URL ?? "https://mainnet.base.org"
  // );
  // const baseWallet = new Wallet(process.env.BASE_PRIVATE_KEY ?? "", provider);
  // const baseClient = await APIClientWrapper.create(baseWallet, "mainnet", {
  //   chain: "base",
  // });
  // const baseTrade = await baseClient.placeOrder(
  //   "uusdc",
  //   0.01,
  //   "btc",
  //   TradeDirectionEnum.LONG,
  //   2,
  //   45000,
  //   70000,
  //   null
  // );
  // console.log("Base Place Order:", baseTrade);
}

// Execute the main function
// main().catch(console.error);
