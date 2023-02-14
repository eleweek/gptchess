import { Chessboard } from 'react-chessboard';


export default function Home() {
  return <div className="container p-2">
    <div className="text-4xl font-bold mb-5">
      <h1>GPT chess</h1>
    </div>
    <div className="w-[700px] h-[700px]">
      <Chessboard id="BasicBoard" />
    </div>
  </div>;


}
