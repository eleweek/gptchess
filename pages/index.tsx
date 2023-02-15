import { Chessboard } from 'react-chessboard';
import { useCallback, useState } from 'react';
import { Chess } from 'chess.js';


const cloneChessState = (orig: Chess) => Object.assign(Object.create(Object.getPrototypeOf(orig)), orig);

export default function GameOfChess() {
  const [game, setGame] = useState(new Chess());

  const safeGameMutate = useCallback((modify: (game: Chess) => void): void => {
    setGame((g: Chess) => {
      const update: Chess = cloneChessState(g);
      modify(update);
      return update;
    });
  }, [setGame]);

  const makeRequest = useCallback((game: Chess) => {
    fetch('/api/get_move?fen=' + encodeURIComponent(game.fen()) + "&pgn=" + encodeURIComponent(game.pgn())).then(response => response.json()).then((json) => {
      console.log("json is", json);
      safeGameMutate((game: Chess) => {
        const possibleMoves = game.moves();
        // exit if the game is over
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) return;
        game.move(json.move);
      });
    }).catch((error) => {
      console.log("fetch move error", error);
    });
  }, [safeGameMutate]);

  const onDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    const gameCopy = cloneChessState(game);

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setGame(gameCopy);

    // illegal move
    if (move === null) return false;

    setTimeout(() => makeRequest(gameCopy), 250);
    return true;
  }, [game, setGame, makeRequest]);


  return <div className="container p-2">
    <div className="text-4xl font-bold mb-5">
      <h1>GPT chess</h1>
    </div>
    <div className="flex flex-row">
      <div className="w-[700px] h-[700px]">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
        />
      </div>
      <div>

      </div>
    </div>
  </div>;
}
