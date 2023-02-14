import { Chessboard } from 'react-chessboard';
import { useCallback, useState } from 'react';
import { Chess } from 'chess.js';


export default function GameOfChess() {
  const [game, setGame] = useState(new Chess());

  const safeGameMutate = useCallback((modify: (game: Chess) => void): void => {
    setGame((g: Chess) => {
      const update: Chess = new Chess(g.fen());
      modify(update);
      return update;
    });
  }, [setGame]);

  const makeRandomMove = useCallback(() => {
    safeGameMutate((game: Chess) => {
      const possibleMoves = game.moves();
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);

      // exit if the game is over
      if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return;

      console.log("makeRnadomMove game", game);
      game.move(possibleMoves[randomIndex]);
    });
  }, [safeGameMutate]);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(game.fen());

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    setTimeout(makeRandomMove, 250);
    return true;
  }, [game, setGame, makeRandomMove]);


  return <div className="container p-2">
    <div className="text-4xl font-bold mb-5">
      <h1>GPT chess</h1>
    </div>
    <div className="w-[700px] h-[700px]">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
      />
    </div>
  </div>;


}
