import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import OpenAI from 'openai';
import pdf from 'pdf-parse';

// Disable Next.js body parsing to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);
    
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the file
    const fileContent = fs.readFileSync(file.filepath);
    
    // Parse PDF to extract text
    const pdfData = await pdf(fileContent);
    const pdfText = pdfData.text;
    
    console.log('PDF parsed, total pages:', pdfData.numpages);

    // Create the prompt
    const prompt = `You are a parser for a neurofeedback report PDF.

TASK: From the provided PDF text, extract the first protocol number listed under the section titled:
"Possible Two Channel Protocols from Eyes Open Brain Map."

CONSTRAINTS:
- Look specifically for the section on page 10 of the PDF.
- Find the line starting with "Protocol #"
- The value to extract is the **first number listed in the 'Protocol #' column** under the Eyes Open section.
- The number is always between **1 and 24**.
- Output just that number—no additional text or explanation.

PDF TEXT:
${pdfText}

EXAMPLE OUTPUT:
8`;

    // Call OpenAI API with the extracted text
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0, // Make it deterministic
    });

    const protocolNumber = response.choices[0].message.content?.trim();
    
    // Validate the response
    const parsedNumber = parseInt(protocolNumber || '', 10);
    if (isNaN(parsedNumber) || parsedNumber < 1 || parsedNumber > 24) {
      console.error('Invalid protocol number:', protocolNumber);
      throw new Error('Invalid protocol number extracted');
    }

    // Clean up the temp file
    fs.unlinkSync(file.filepath);

    return res.status(200).json({ protocol: parsedNumber });
  } catch (error) {
    console.error('Error extracting protocol:', error);
    return res.status(500).json({ 
      error: 'Failed to extract protocol', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
