// app/api/chat/route.js
// Connects to OpenAI to generate adaptive learning responses
// Protected — requires valid Supabase session

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseServer';

export async function POST(request) {
  // 1. Auth check
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { message, topic, history = [] } = await request.json();
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

  // 2. Fetch user preferences (learning style, font scale etc.)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 3. Build system prompt based on topic and learning preferences
  const systemPrompt = `You are AALIM, an adaptive learning assistant specialising in ${topic || 'general knowledge'}.

Your goal is to explain concepts clearly and engagingly to the student.
Always structure your response well. Use **bold** for key terms.
Use \`code\` formatting for any code or technical terms.

Keep explanations concise but thorough. Prefer step-by-step explanations.
Avoid jargon unless you define it first.

Do NOT add unnecessary disclaimers. Do NOT say "Great question!".
Be direct, warm, and educational.`;

  // 4. Build messages array for OpenAI
  const openaiMessages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
    { role: 'user',   content: message },
  ];

  try {
    // 5. Call OpenAI
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model:       process.env.OPENAI_MODEL || 'gpt-4o',
        messages:    openaiMessages,
        max_tokens:  1000,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('OpenAI error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data    = await res.json();
    const content = data.choices?.[0]?.message?.content || 'Sorry, no response was generated.';

    // 6. Save chat to Supabase (optional — saves most recent session)
    await supabase.from('chat_history').insert({
      user_id:   user.id,
      title:     message.slice(0, 60),
      messages:  [...history, { role: 'user', content: message }, { role: 'assistant', content }],
      topic_key: topic,
    });

    return NextResponse.json({ content });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
