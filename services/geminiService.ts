import { GoogleGenAI } from "@google/genai";
import { UploadedImage } from "../types";

const processEnvApiKey = process.env.API_KEY;

export const generateCruiseImage = async (
  personImage: UploadedImage,
  logoImage: UploadedImage | null
): Promise<string> => {
  if (!processEnvApiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: processEnvApiKey });

  const parts: any[] = [];

  // 1. Add Person Image
  parts.push({
    inlineData: {
      data: personImage.base64,
      mimeType: personImage.mimeType,
    },
  });

  // 2. Add Logo Image if exists
  if (logoImage) {
    parts.push({
      inlineData: {
        data: logoImage.base64,
        mimeType: logoImage.mimeType,
      },
    });
  }

  // 3. Construct the prompt
  const prompt = `
    Você é um especialista em manipulação de imagem realista e criativa.
    
    INSTRUÇÕES:
    Use a primeira imagem fornecida (pessoa) e coloque-a em um cenário de cruzeiro de luxo.
    ${logoImage ? 'Use a segunda imagem fornecida como o LOGO do navio e insira-a no cenário (ex: em uma bandeira, parede, cardápio ou detalhe do navio).' : 'O nome do navio é "Os Milionários".'}
    
    CENÁRIO:
    - Parte de cima (deck) do navio de cruzeiro chamado "Os Milionários".
    - Dia ensolarado, mar visível ao fundo.
    - Estilo fotorealista de alta qualidade.

    REGRAS DE APARÊNCIA (CRÍTICO):
    - NÃO altere a aparência facial das pessoas.
    - Mantenha acessórios de cabeça (como bonés/chapéus) se a pessoa já estiver usando.
    
    LÓGICA DE COMPOSIÇÃO:
    Analise a primeira imagem e aplique EXATAMENTE a regra correspondente:

    CASO 1: Se houver DUAS pessoas na foto:
    - Elas devem estar conversando e sorrindo.
    
    CASO 2: Se houver UMA pessoa com BARBA (Homem com barba):
    - IMPORTANTE: Ele deve ser caracterizado como um GARÇOM.
    - Ele está servindo drinks para outras pessoas (pode haver figurantes desfocados ou apenas a ação de servir).
    - Ignore as regras de vestuário casual abaixo, vista-o apropriadamente como staff/garçom de luxo, mas mantenha suas características faciais e barba.

    CASO 3: Se houver UMA pessoa SEM barba (Homem):
    - Ação: Tomando um drink e olhando para o mar.
    - Vestuário: Short, óculos de sol, tênis, boné (se já não tiver, adicione; se tiver, mantenha), camisa polo.

    CASO 4: Se houver UMA pessoa (Mulher):
    - Ação: Tomando um drink e olhando para o mar.
    - Vestuário: Short, óculos de sol, chinelos, chapéu de praia, maiô e saída de banho.

    Gere a imagem final seguindo rigorosamente estas condições.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using Flash Image for editing/generation capabilities
      contents: {
        parts: parts
      },
      config: {
        // Optional: guide the aspect ratio if needed, but 1:1 is usually default safe bet
        // imageConfig: { aspectRatio: "16:9" } 
      }
    });

    // Check for inlineData (image)
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Não foi possível gerar a imagem. Tente novamente.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw error;
  }
};