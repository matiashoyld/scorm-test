export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only allow GET and POST methods
  if (request.method !== 'GET' && request.method !== 'POST') {
    return new Response('Method not allowed', {
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
    });
  }

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-1106-preview",  // Using a known valid model
        voice: "alloy",
        instructions: "Eres un asistente de IA amigable y servicial. Siempre respondes en español, independientemente del idioma en que te hablen. Mantienes un tono conversacional y profesional. Si te hablan en otro idioma, entiendes perfectamente pero SIEMPRE respondes en español."
      }),
    });
    
    if (!r.ok) {
      const error = await r.json();
      console.error('OpenAI API Error:', error);
      return new Response(JSON.stringify(error), {
        status: r.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    const data = await r.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
} 