import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    // Generate keywords
    const keywordsPrompt = `Given the following topic about photobiomodulation (PBM) therapy, generate 5-7 highly relevant SEO keywords that someone might search for. Focus on specific conditions, treatments, and benefits.

Topic: "${input}"

Return ONLY a JSON array of keywords, no explanation. Example: ["photobiomodulation therapy", "red light therapy benefits", "PBM for brain health"]`;

    const keywordsResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert specializing in photobiomodulation and medical content. Always return valid JSON.'
        },
        {
          role: 'user',
          content: keywordsPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const keywordsText = keywordsResponse.choices[0]?.message?.content || '[]';
    let keywords: string[] = [];
    
    try {
      keywords = JSON.parse(keywordsText);
    } catch (e) {
      console.error('Failed to parse keywords:', keywordsText);
      keywords = [
        'photobiomodulation therapy',
        'red light therapy',
        'PBM treatment',
        'light therapy benefits',
        'non-invasive therapy'
      ];
    }

    // Generate headlines
    const headlinesPrompt = `Create 5 compelling, SEO-optimized blog headlines about photobiomodulation based on this topic: "${input}"

Requirements:
- Include relevant keywords naturally
- Make them engaging and click-worthy
- Focus on benefits, solutions, or answering questions
- Keep them between 50-60 characters when possible
- Mix different headline types (how-to, listicles, questions, statements)

Keywords to consider: ${keywords.join(', ')}

Return ONLY a JSON array of 5 headlines, no explanation.`;

    const headlinesResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter specializing in medical and wellness content. Create engaging, SEO-friendly headlines. Always return valid JSON.'
        },
        {
          role: 'user',
          content: headlinesPrompt
        }
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    const headlinesText = headlinesResponse.choices[0]?.message?.content || '[]';
    let headlines: string[] = [];
    
    try {
      headlines = JSON.parse(headlinesText);
    } catch (e) {
      console.error('Failed to parse headlines:', headlinesText);
      headlines = [
        `How Photobiomodulation Can Help With ${input}`,
        `The Science Behind PBM Therapy for ${input}`,
        `${input}: A Natural Solution with Red Light Therapy`,
        `Understanding Photobiomodulation Benefits for ${input}`,
        `Why Doctors Recommend PBM for ${input}`
      ];
    }

    // Ensure we have exactly 5 headlines
    if (headlines.length > 5) {
      headlines = headlines.slice(0, 5);
    } else if (headlines.length < 5) {
      // Add generic headlines if needed
      const genericHeadlines = [
        'Photobiomodulation: Your Guide to Natural Healing',
        'How Red Light Therapy Transforms Patient Outcomes',
        'The Future of Non-Invasive Treatment is Here',
        'Unlock Your Body\'s Natural Healing Power with PBM',
        'Evidence-Based Light Therapy for Better Health'
      ];
      headlines = [...headlines, ...genericHeadlines].slice(0, 5);
    }

    res.status(200).json({
      keywords,
      headlines
    });

  } catch (error) {
    console.error('Error generating blog ideas:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog ideas',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
