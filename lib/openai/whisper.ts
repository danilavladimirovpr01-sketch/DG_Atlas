import OpenAI from 'openai';

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function transcribeAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const file = new File([new Uint8Array(audioBuffer)], fileName, {
    type: 'audio/mpeg',
  });

  const transcription = await groq.audio.transcriptions.create({
    model: 'whisper-large-v3',
    file,
    language: 'ru',
  });

  return transcription.text;
}
