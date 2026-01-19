import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { text } = req.body

  if (!text) {
    return res.status(400).json({ message: 'Text is required' })
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful translator. Translate the following text to French. Return only the translated text."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3,
    })

    const translatedText = response.choices[0].message.content?.trim()

    res.status(200).json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    res.status(500).json({ message: 'Error translating text' })
  }
}
