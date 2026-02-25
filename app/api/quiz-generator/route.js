// app/api/quiz-generator/route.js
// Generates dynamic quiz questions based on topic using Google Gemini
// Falls back to static TEST_BANK if the AI generation fails

import { NextResponse } from 'next/server';
import { TEST_BANK } from '@/lib/constants';

export async function POST(request) {
  try {
    const { topic = 'programming', query = '', adhd_mode = false } = await request.json();

    // Validate topic exists in our system
    const validTopics = Object.keys(TEST_BANK);
    if (!validTopics.includes(topic)) {
      // Return static questions if invalid topic
      return NextResponse.json({
        questions: TEST_BANK.programming,
        source: 'static',
      });
    }

    // Build system prompt for quiz generation
    const numQuestions = adhd_mode ? 3 : 5; // Fewer questions in ADHD mode
    const difficultyText = adhd_mode 
      ? 'Easy to moderate (simplified explanations, clear language)' 
      : 'Moderate (good for revision/testing)';
    const quizSubject = query || topic; // Use specific query/subject if provided
    
    const systemPrompt = `You are a quiz master for AALIM learning platform.
Your task is to generate ${numQuestions} multiple-choice quiz questions for the topic: ${quizSubject}.

Requirements:
1. Questions should test understanding of core concepts
2. Each question has 4 options (A, B, C, D)
3. One option is the correct answer
4. Include helpful explanations for each answer
5. Difficulty should be ${difficultyText}
6. Questions should be specific and clear${adhd_mode ? '\n7. ADHD-FRIENDLY: Use simple language, avoid jargon, short questions' : ''}

Return ONLY valid JSON with this exact structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this is the correct answer..."
    }
  ]
}

Important: Return only the JSON object, no other text. Generate exactly ${numQuestions} questions.`;

    // Call Gemini API to generate questions
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GOOGLE_MODEL || 'gemini-2.5-flash'}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nGenerate ${numQuestions} quiz questions for: ${quizSubject}.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: adhd_mode ? 1200 : 2000,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error('Gemini API error, falling back to static questions');
      // Fallback to static TEST_BANK
      return NextResponse.json({
        questions: TEST_BANK[topic] || TEST_BANK.programming,
        source: 'static',
        note: 'Using pre-generated questions (dynamic generation unavailable)',
      });
    }

    const data = await res.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Failed to generate content';

    // Parse the JSON response from Gemini
    let generatedQuestions;
    try {
      // Extract JSON from the response (in case of extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      generatedQuestions = parsed.questions || [];

      // Validate the questions structure
      if (
        !Array.isArray(generatedQuestions) ||
        generatedQuestions.length === 0
      ) {
        throw new Error('Invalid questions structure');
      }

      // Ensure correct index is 0-3
      generatedQuestions = generatedQuestions.map((q) => ({
        ...q,
        correct: Math.max(0, Math.min(3, parseInt(q.correct) || 0)),
      }));

      return NextResponse.json({
        questions: generatedQuestions,
        source: 'dynamic',
        topic,
      });
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      // Fallback to static TEST_BANK on parsing error
      return NextResponse.json({
        questions: TEST_BANK[topic] || TEST_BANK.programming,
        source: 'static',
        note: 'Using pre-generated questions (parsing failed)',
      });
    }
  } catch (err) {
    console.error('Quiz generation error:', err);
    // Final fallback to static questions
    return NextResponse.json({
      questions: TEST_BANK.programming,
      source: 'static',
      note: 'Using fallback questions',
    });
  }
}
