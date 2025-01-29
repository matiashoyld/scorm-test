export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store'
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

export async function GET() {
  return handleRequest();
}

export async function POST() {
  return handleRequest();
}

async function handleRequest() {
  try {
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy",
        instructions: "Eres un asistente de IA amigable y servicial. Siempre respondes en español, independientemente del idioma en que te hablen. Mantienes un tono conversacional y profesional. Si te hablan en otro idioma, entiendes perfectamente pero SIEMPRE respondes en español."
      }),
    });
    
    if (!response.ok) {
      const data = await response.json();
      console.error('OpenAI API Error:', data);
      return new Response(JSON.stringify({
        error: data.error?.message || 'Failed to get token'
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      });
    }
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });
  } catch (error) {
    console.error('Token generation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      },
    });
  }
} 