// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROMPT = `You are a superintelligent and supporting coach playing a chess. The following is a chess game state in the FEN notation. Make a move and provide an explnation, separate them with a semicolon(";").

The game state: 
{{FEN}}
Previous moves in PGN notation: {{PGN}}

Move and explanation:
`;

type Data = {
  error: string | null,
  move: string | null,
  explanation: string | null,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { fen } = req.query;
  const { pgn } = req.query;

  console.log("Received fen: ", fen);
  console.log("Received pgn: ", pgn);

  if (!fen || Array.isArray(fen)) {
    res.status(400).json({ error: 'Invalid FEN', move: null, explanation: null });
    return;
  }

  const prompt = PROMPT.replace('{{FEN}}', fen).replace('{{PGN}}', pgn);
  console.log("Sending prompt: ", prompt);

  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    max_tokens: 128,
    temperature: 0.8,
  });

  const responseText = response.data.choices[0].text;
  console.log("Received response text: ", responseText);

  const [move, explanation] = responseText.split(';');
  res.status(200).json({ error: null, move, explanation });
}
