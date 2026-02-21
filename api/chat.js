export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the API key from environment variable (secure!)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { messages } = req.body;

        // Convert chat history to Gemini format
        const geminiMessages = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: geminiMessages,
                systemInstruction: {
                    parts: [{ 
                        text: 'You are a helpful health assistant specializing in sleep and caffeine. Provide accurate, helpful answers. Keep responses concise (2-4 sentences for simple questions).' 
                    }]
                },
                generationConfig: {
                    maxOutputTokens: 1000
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: data.error?.message || 'API error' });
        }

        // Extract text from Gemini response
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

        // Return in a consistent format
        return res.status(200).json({
            content: [{ text: aiText }]
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Failed to process request' });
    }
}
