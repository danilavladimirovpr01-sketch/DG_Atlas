import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioBuffer: Buffer, fileName: string): Promise<string> {
  const file = new File([new Uint8Array(audioBuffer)], fileName, {
    type: 'audio/mpeg',
  });

  const transcription = await openai.audio.transcriptions.create({
    model: 'whisper-1',
    file,
    language: 'ru',
  });

  return transcription.text;
}
