export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const { pathname } = new URL(request.url);

    if (pathname === "/api/chat") return handleChat(request, env);
    if (pathname === "/api/embeddings") return handleEmbeddings(request, env);
    if (pathname === "/api/moderation") return handleModeration(request, env);

    return json({ error: "Not found" }, 404);
  } catch (error) {
    return json({ error: error.message || "Internal Server Error" }, 500);
  }
}

function json(responseData, status = 200) {
  return new Response(JSON.stringify(responseData), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

// Chat
async function handleChat(request, env) {
  const { messages, model = "gpt-4.1" } = await request.json();

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return json({ error: "messages must be a non-empty array" }, 400);
  }

  const chatCompletion = await env.OPENAI.chat.completions.create({
    model,
    messages
  });

  return json(chatCompletion);
}

// Embeddings
async function handleEmbeddings(request, env) {
  const { input, model = "text-embedding-3-large" } = await request.json();

  if (!input || (typeof input === "string" && input.trim() === "") || (Array.isArray(input) && input.length === 0)) {
    return json({ error: "input must be a non-empty string or array" }, 400);
  }

  const embeddingResult = await env.OPENAI.embeddings.create({
    model,
    input
  });

  return json(embeddingResult);
}

// Moderation
async function handleModeration(request, env) {
  const { input } = await request.json();

  if (!input || (typeof input === "string" && input.trim() === "") || (Array.isArray(input) && input.length === 0)) {
    return json({ error: "input must be a non-empty string or array" }, 400);
  }

  const moderationResult = await env.OPENAI.moderations.create({
    model: "omni-moderation-latest",
    input
  });

  return json(moderationResult);
}
