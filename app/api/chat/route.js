// app/api/chat/route.js
// Connects to Google Gemini AI to generate adaptive learning responses
// Saves chat history to Supabase if user is logged in

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function POST(request) {
  const supabase = createServerSupabase();
  
  // 1. Check if user is logged in (optional - chat works without login)
  const { data: { user } } = await supabase.auth.getUser();
  
  const { message, topic, history = [], adhd_mode = false } = await request.json();
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  // 2. Build system prompt based on topic
  const adhdModeInstructions = adhd_mode 
    ? `\n\nADHD-FRIENDLY MODE ACTIVE:
- Keep responses SHORT and focused (max 2-3 short paragraphs)
- Break complex ideas into tiny, digestible chunks
- Use bullet points instead of long paragraphs when possible
- One main idea per message - ask follow-up questions to explore further
- Avoid overwhelming lists or too much information at once`
    : '';

  const systemPrompt = `You are AALIM, an adaptive learning assistant specialising in ${topic || 'general knowledge'}.

Your goal is to explain concepts clearly and engagingly to the student.
Always structure your response well. Use **bold** for key terms.
Use \`code\` formatting for any code or technical terms.

IMPORTANT: Highlight the most important or critical sentences by wrapping them with [IMPORTANT] and [/IMPORTANT] tags.
Examples:
- [IMPORTANT]Variables store data in memory[/IMPORTANT]
- [IMPORTANT]Photosynthesis converts light energy into chemical energy[/IMPORTANT]

Keep explanations concise but thorough. Prefer step-by-step explanations.
Avoid jargon unless you define it first.

Do NOT add unnecessary disclaimers. Do NOT say "Great question!".
Be direct, warm, and educational.${adhdModeInstructions}`;

  // 3. Build conversation for Gemini
  const conversationHistory = history.slice(-10).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    // 4. Call Google Gemini API
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GOOGLE_MODEL || 'gemini-2.5-flash'}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...conversationHistory,
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser question: ${message}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: adhd_mode ? 500 : 1000,
          }
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      console.error('Google Gemini API error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response was generated.';

    // 5. Save chat history to Supabase (only if user is logged in)
    if (user) {
      try {
        const fullMessages = [
          ...history,
          { role: 'user', content: message },
          { role: 'assistant', content }
        ];

        const { data, error } = await supabase.from('chat_history').insert({
          user_id: user.id,
          title: message.slice(0, 60),
          messages: fullMessages,
          topic_key: topic,
        });

        if (error) {
          console.error('Database save error:', error);
        } else {
          console.log('Chat saved successfully for user:', user.id);
        }
      } catch (dbError) {
        console.error('Failed to save chat history:', dbError);
        // Don't fail the request if saving fails
      }
    } else {
      console.log('No user logged in - chat not saved');
    }

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
