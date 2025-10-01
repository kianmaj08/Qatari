// Netlify Function – Herbert (GPT-5-mini)
const ALLOWED_ORIGIN = "*";

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }};
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Use POST" }) };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "OPENAI_API_KEY missing" }) };
  }

  let message = "";
  try {
    const body = JSON.parse(event.body || "{}");
    message = String(body.message || "").slice(0, 4000);
  } catch {
    return { statusCode: 400, headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  try {
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          { role: "system", content: "Du heißt Herbert. Du antwortest kurz, klar, sachlich, wie ein Schüler aus der Q1. Keine Emojis." },
          { role: "user", content: message }
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return { statusCode: 502, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
               body: JSON.stringify({ error: "Upstream error", detail: text }) };
    }

    const data = await resp.json();
    let reply = "Ich bin mir unsicher. Formuliere die Frage bitte präziser.";
    if (data.output?.[0]?.content?.[0]?.text) reply = data.output[0].content[0].text;
    else if (data.choices?.[0]?.message?.content) reply = data.choices[0].message.content;

    return { statusCode: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
             body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": ALLOWED_ORIGIN },
             body: JSON.stringify({ error: "Function error", detail: String(err) }) };
  }
};
