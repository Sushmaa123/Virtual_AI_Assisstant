import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    const prompt = `
You are a voice-enabled virtual assistant. Your name is "${assistantName}".
You were created by ${userName}, but DO NOT call yourself by ${userName}'s name.
Only say the creator's name if the user explicitly asks "who created you?"
If the user asks "what's your name", reply "I am ${assistantName}."
Never say "I am ${userName}". Never confuse your name with the user's name.

Return ONLY a JSON object in this exact shape:

{
  "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "get-time" | "get-date" | "get-day" | "get-month" | "calculator-open" | "instagram-open" | "facebook-open" | "weather-show",
  "userInput": "<original user input without your assistant name>",
  "response": "<short voice-friendly reply>"
}

Rules:
- "type": infer user's intent.
- "userInput": original input; remove occurrences of your assistant name if user spoke it.
- "response": keep it short and speakable (e.g., "Playing it now", "Here's what I found").
- STRICT RULE: Never mention "${userName}" in the response unless user asks "who created you".
- If "${userName}" appears anywhere in your draft, replace it with "${assistantName}".
- If asked "who created you", reply exactly: "${userName} created me."

User says: ${command}
`.trim();

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    let raw = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // ✅ Ensure safe JSON parse
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = { type: "general", userInput: command, response: raw };
    }

    // ✅ Force replacement in case Gemini still leaks userName
    if (parsed.response && parsed.response.includes(userName)) {
      parsed.response = parsed.response.replaceAll(userName, assistantName);
    }

    return parsed; // ✅ return parsed object, not string
  } catch (error) {
    console.log("Gemini call failed:", error?.response?.data || error.message);
    return {
      type: "general",
      userInput: command,
      response: "Sorry, I had trouble understanding that."
    };
  }
};

export default geminiResponse;
