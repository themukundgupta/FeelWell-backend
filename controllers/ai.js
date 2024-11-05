import Groq from "groq-sdk";
import dotenv from 'dotenv';
import { AppError } from '../utils/appError.js';

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.error('Groq API key is missing. Please check your .env file.');
  process.exit(1);
}

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

const systemPrompt = `You are an empathetic AI mental health companion. Your role is to:
- Provide supportive, non-judgmental responses
- Help users explore their thoughts and feelings
- Suggest healthy coping strategies when appropriate
- Encourage professional help when needed
- Never provide medical advice or diagnosis
- Maintain a warm, understanding tone
- Write short messages and act as a friend`;

export const chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return next(new AppError('Message is required', 400));
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 512
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response received from Groq');
    }

    res.status(200).json({
      status: 'success',
      data: { response: aiResponse }
    });
  } catch (error) {
    console.error('Groq API error:', error);
    next(new AppError('Failed to generate AI response', 500));
  }
};