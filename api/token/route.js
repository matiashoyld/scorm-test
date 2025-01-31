import { config } from 'dotenv';

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  config();
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Page-Content',
  'Cache-Control': 'no-store'
};

// Handle CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders
  });
}

// Handle both GET and POST requests
export async function GET(req) {
  return handleRequest(req);
}

export async function POST(req) {
  return handleRequest(req);
}

async function handleRequest(req) {
  try {
    // Decode page content from header
    let pageContent = 'No hay contenido disponible';
    const encodedContent = req.headers.get('x-page-content');
    
    if (encodedContent) {
      try {
        pageContent = decodeURIComponent(escape(atob(encodedContent)));
        console.log('Successfully decoded page content:', pageContent);
      } catch (e) {
        console.error('Error decoding page content:', e);
        console.error('Error details:', {
          message: e.message,
          stack: e.stack
        });
      }
    } else {
      console.log('No x-page-content header found');
    }

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: "alloy", 
        instructions: `Eres un tutor ayudando al usuario a aprender inglés.
        
        Instrucciones:

        1. Comienza hablando en español diciendo: "Hola, soy tu tutor de idiomas. A partir de ahora te hablaré en inglés, pero si cometes algún error, te corregiré en español".
        2. Luego, mantén una conversación con el usuario sobre el curso que está realizando.
        3. La conversación debe ser en inglés después de tu introducción en español. Si el usuario comete algún error hablando en inglés, debes corregirlo en español, y luego volver a hablar en inglés. 
        4. Solo debes corregir al usuario en español si comete errores, sino, debes continuar la conversación en inglés.
        
        Este es el contenido del curso: 
        %%%%
        ${pageContent}
        %%%%
        `
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