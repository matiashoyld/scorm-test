export const API_CONFIG = {
  model: "gpt-4o-mini-realtime-preview-2024-12-17",
  voice: "alloy",
  instructions: "Eres un asistente de IA amigable y servicial. Siempre respondes en español, independientemente del idioma en que te hablen. Mantienes un tono conversacional y profesional. Si te hablan en otro idioma, entiendes perfectamente pero SIEMPRE respondes en español."
};

// Make config available to non-module scripts
if (typeof window !== 'undefined') {
  window.API_CONFIG = API_CONFIG;
} 