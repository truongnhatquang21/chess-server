import { Chess__factory } from "../../../contracts";
import { roninProvider } from "../web3";
import { FunctionFragment, ParamType } from "@ethersproject/abi";
import { TGame } from "@/types/chess";
import { parseResult } from "../../../lib/web3";

const chessContractAddress = "0x757FEAa65FB76746BB0956d111014C35Cf40f87a";
export const chessContract = Chess__factory.connect(
  chessContractAddress,
  roninProvider
);
export const syncWithContractChessGame = (
  gameId: string,
  callback: (gameInfor: TGame) => void
) => {
  chessContract.on("*", async () => {
    const gameInfo = await getGameInfo(gameId);
    console.log("🚀 ~ chessContract.on ~ gameInfo:", gameInfo);
    if (gameInfo) callback(gameInfo);
  });
};

export const getGameInfo = async (gameId: string) => {
  const gameInfo = await chessContract.getGameInfo(gameId);
  console.log("🚀 ~ getGameInfo ~ gameInfo", gameInfo);

  const gameFragment = chessContract.interface.fragments.find((fragment) => {
    return fragment.name === "getGameInfo";
  }) as FunctionFragment;
  if (gameFragment) {
    const parsedResult = parseResult<TGame>(
      gameInfo,
      gameFragment.outputs as ParamType[]
    );
    console.log("🚀 ~ getGameInfo ~ parsedResult", parsedResult);

    //parsed in to TGame
    parsedResult.playersAddress = parsedResult?.players.split(",");
    parsedResult.firstPlayerIndex = parsedResult.firstPlayerIndex;
    if (parsedResult.decodedMessage && parsedResult.playersAddress) {
      const decodedMessageList = [];
      const decodedMessageParsed = parsedResult.decodedMessage.split(",");
      for (let i = 0; i < parsedResult.playersAddress.length; i++) {
        if (Number(decodedMessageParsed[i]) >= 0) {
          decodedMessageList.push(parsedResult.playersAddress[i]);
        }
      }
      parsedResult.decodedMessageArray = decodedMessageList;
    }
    parsedResult.latestMoveCountOnContract =
      parsedResult.latestState.split(",")[2];

    return parsedResult;
  }
};
