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

  const { input, headline, keywords } = req.body;

  if (!input || !headline || !Array.isArray(keywords)) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const blogPrompt = `You are a top-tier medical copywriter and educator tasked with writing the **body content** (including all H2 and H3 headings) for a blog post about photobiomodulation/red light therapy.

HEADLINE: ${headline}

ORIGINAL TOPIC: ${input}

TARGET KEYWORDS: ${keywords.join(', ')}

Your audience is intelligent but non-technical—curious readers, wellness seekers, and forward-thinking practitioners. Your goal is to **teach them something they didn't know**, while keeping them engaged and making the science approachable.

Write in a tone that is:
- Friendly and conversational (without being fluffy)
- Fun to read (with metaphors or light humor when helpful)
- Authoritative but not clinical
- Curious and momentum-driven ("Did you know…?" "Let's break this down.")

**Structure your response with clear H2 and H3 tags** that:
- Spark curiosity
- Break up the content visually
- Naturally support SEO

Each section should:
- Explain *why it matters*
- Include analogies or relatable comparisons where useful
- Tie back to how red light therapy (photobiomodulation) works or helps
- Avoid regurgitating generic PBM definitions—go deeper, or fresher

Include specific examples, mechanisms of action (in plain English), and close with a call to action that invites the reader to take the next step (learn more, try it, or find a practitioner).

Keep it 800–1,000 words.

FORMAT: Return the blog content in Markdown format with proper headings (##, ###), bullet points where appropriate, and emphasis on key points.

Also provide a brief description (50-100 words) for an AI image generator that would create a relevant, professional featured image for this blog post.

Return as JSON with this structure:
{
  "content": "Full blog content in Markdown",
  "image_description": "Description for AI image generation"
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert medical content writer specializing in photobiomodulation therapy. You write engaging, SEO-optimized content that is both informative and accessible to a general audience while maintaining scientific accuracy. Always return valid JSON.'
        },
        {
          role: 'user',
          content: blogPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseText = response.choices[0]?.message?.content || '{}';
    
    let blogData;
    try {
      blogData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse blog content:', e);
      
      // Fallback content
      blogData = {
        content: `## ${headline}

Welcome to the fascinating world of photobiomodulation (PBM) therapy, where cutting-edge science meets practical healing solutions. If you're looking for information about ${input}, you've come to the right place.

### What is Photobiomodulation?

Photobiomodulation, also known as red light therapy or low-level laser therapy, is a non-invasive treatment that uses specific wavelengths of light to stimulate cellular function and promote healing. This innovative therapy has been gaining recognition in the medical community for its remarkable ability to address various health conditions without the need for medications or surgery.

### How Does PBM Work?

At its core, PBM works by delivering specific wavelengths of red and near-infrared light to your cells. These wavelengths (typically between 660-850nm) penetrate the skin and are absorbed by mitochondria, the powerhouses of your cells. This absorption triggers a cascade of beneficial cellular responses:

- **Enhanced ATP production**: More cellular energy means better cell function
- **Reduced inflammation**: Light therapy helps calm inflammatory responses
- **Improved circulation**: Better blood flow delivers more oxygen and nutrients
- **Accelerated healing**: Cells repair and regenerate more efficiently

### The Science Behind the Benefits

Research into photobiomodulation has exploded in recent years, with thousands of peer-reviewed studies demonstrating its effectiveness. Scientists have found that PBM can:

- Reduce pain and inflammation
- Accelerate wound healing
- Improve cognitive function
- Enhance muscle recovery
- Support mental health
- Boost immune function

### What to Expect from Treatment

If you're considering PBM therapy, here's what you can typically expect:

1. **Consultation**: Your healthcare provider will assess your condition and determine the appropriate treatment protocol
2. **Treatment sessions**: Sessions typically last 10-20 minutes
3. **Frequency**: Most conditions require 2-3 sessions per week initially
4. **Results**: Many people notice improvements within 2-4 weeks

### Why Healthcare Providers are Embracing PBM

More and more healthcare professionals are incorporating photobiomodulation into their practice because:

- It's completely non-invasive
- There are virtually no side effects
- It complements other treatments well
- Results are often dramatic and long-lasting
- It addresses root causes, not just symptoms

### Getting Started with Photobiomodulation

If you're interested in exploring how PBM therapy could help with ${input}, the first step is to find a qualified practitioner in your area. Look for providers who:

- Have proper training in photobiomodulation
- Use FDA-cleared devices
- Can explain the science behind the treatment
- Offer personalized treatment plans

### Conclusion

Photobiomodulation represents a powerful intersection of technology and natural healing. Whether you're dealing with ${input} or simply looking to optimize your health, PBM therapy offers a safe, effective, and scientifically-backed approach to healing and wellness.

Ready to experience the benefits of photobiomodulation for yourself? Contact a qualified PBM practitioner today and take the first step toward better health through the power of light.

*Remember, while PBM therapy has shown remarkable results for many conditions, it's always important to consult with a healthcare professional before starting any new treatment.*`,
        image_description: "Professional medical setting showing a modern photobiomodulation device emitting soft red light, with a calm patient receiving treatment, conveying healing and advanced technology in a clean, clinical environment"
      };
    }

    res.status(200).json({
      blog: blogData
    });

  } catch (error) {
    console.error('Error generating blog content:', error);
    res.status(500).json({ 
      error: 'Failed to generate blog content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
