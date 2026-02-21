module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    // Basic guardrails: keep last 10 messages, drop empty, cap size
    const contents = messages
      .filter(m => m?.content && typeof m.content === "string" && m.content.trim())
      .slice(-10)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content.slice(0, 4000) }]
      }));

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [
              {
                text:
                  "You are a helpful health assistant specializing in sleep and caffeine. " +
                  "Provide accurate, evidence-based answers. Keep responses concise (2–4 sentences for simple questions). " +
                  "If the user asks for medical advice, suggest consulting a professional."
              }
            ]
          },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600
          }
        })
      }
    );

    const data = await r.json();

    if (!r.ok) {
      console.error("Gemini API error:", data);
      return res.status(r.status).json({
        error: data?.error?.message || "Gemini API error"
      });
    }

    const aiText =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        .join(" ")
        .trim() || "Sorry, I could not generate a response.";

    return res.status(200).json({ content: [{ text: aiText }] });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Failed to process request" });
  }
};
