import React, { useState } from 'react';
import { UploadedImage, GenerationState } from './types';
import { ImageUploader } from './components/ImageUploader';
import { generateCruiseImage } from './services/geminiService';
import { Anchor, Loader2, Download, RefreshCw, Ship, Info } from 'lucide-react';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<UploadedImage | null>(null);
  const [logoImage, setLogoImage] = useState<UploadedImage | null>(null);
  const [generationState, setGenerationState] = useState<GenerationState>({ isLoading: false });

  const handleGenerate = async () => {
    if (!personImage) return;

    setGenerationState({ isLoading: true, error: undefined });

    try {
      const resultBase64 = await generateCruiseImage(personImage, logoImage);
      setGenerationState({
        isLoading: false,
        resultImage: resultBase64
      });
    } catch (error: any) {
      setGenerationState({
        isLoading: false,
        error: error.message || "Ocorreu um erro ao processar sua imagem."
      });
    }
  };

  const handleReset = () => {
    setPersonImage(null);
    setLogoImage(null);
    setGenerationState({ isLoading: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-full text-blue-900">
              <Ship size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-wide text-yellow-50">Os Milionários</h1>
              <p className="text-xs md:text-sm text-blue-200 uppercase tracking-widest font-semibold">Cruise Experience AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-4">
            Embarque nesta Experiência
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Envie sua foto e nossa Inteligência Artificial irá transportá-lo diretamente para o deck do cruzeiro mais exclusivo do mundo. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Inputs */}
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-2 pb-4 border-b border-slate-100">
              <Anchor className="text-blue-600" size={20} />
              <h3 className="text-xl font-bold text-slate-800">Configure sua Viagem</h3>
            </div>

            <div className="space-y-6">
              <ImageUploader 
                id="person-upload"
                label="1. Sua Foto (Obrigatório)"
                helperText="Envie uma foto clara de rosto ou corpo inteiro."
                image={personImage}
                onImageUpload={setPersonImage}
              />

              <ImageUploader 
                id="logo-upload"
                label="2. Logo do Navio (Opcional)"
                helperText="O logo 'Os Milionários' será inserido no cenário."
                image={logoImage}
                onImageUpload={setLogoImage}
              />
            </div>

            {/* Rules Info */}
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-slate-700 border border-blue-100">
              <div className="flex items-start gap-2 mb-2">
                <Info size={16} className="text-blue-600 mt-0.5" />
                <span className="font-bold text-blue-900">Como funciona a mágica:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 ml-1 text-slate-600">
                <li>Homens com barba serão os nossos garçons exclusivos.</li>
                <li>Homens sem barba relaxam com polo e shorts.</li>
                <li>Mulheres aproveitam o sol com drink e chapéu.</li>
                <li>Casais celebram juntos sorrindo.</li>
              </ul>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!personImage || generationState.isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2
                ${!personImage || generationState.isLoading 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none hover:translate-y-0' 
                  : 'bg-gradient-to-r from-blue-700 to-blue-900 text-white hover:shadow-blue-900/30'
                }`}
            >
              {generationState.isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Preparando o convés...
                </>
              ) : (
                <>
                  Gerar Minha Foto no Cruzeiro
                </>
              )}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="relative min-h-[400px] flex flex-col h-full">
             {generationState.resultImage ? (
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 text-center font-serif">Bem-vindo a Bordo!</h3>
                  <div className="relative rounded-xl overflow-hidden shadow-inner border border-slate-100 group">
                    <img 
                      src={generationState.resultImage} 
                      alt="Generated Cruise Scene" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <a 
                      href={generationState.resultImage} 
                      download="os-milionarios-cruzeiro.png"
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <Download size={18} />
                      Baixar Foto
                    </a>
                    <button 
                      onClick={handleReset}
                      className="flex-none bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 rounded-lg transition-colors border border-slate-200"
                      title="Criar nova imagem"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center">
                  {generationState.isLoading ? (
                    <div className="flex flex-col items-center animate-pulse">
                       <Ship size={64} className="text-blue-300 mb-4 animate-bounce" />
                       <h3 className="text-xl font-bold text-slate-600 mb-2">A IA está trabalhando...</h3>
                       <p className="text-slate-500 max-w-xs">Estamos ajustando o cenário, servindo os drinks e posicionando o navio.</p>
                    </div>
                  ) : generationState.error ? (
                    <div className="flex flex-col items-center text-red-500">
                      <div className="bg-red-100 p-4 rounded-full mb-4">
                        <Info size={32} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Ops! Algo deu errado.</h3>
                      <p className="text-sm text-slate-600 mb-4 max-w-xs">{generationState.error}</p>
                      <button 
                        onClick={() => setGenerationState({ isLoading: false })}
                        className="text-blue-600 underline text-sm hover:text-blue-800"
                      >
                        Tentar novamente
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center opacity-60">
                      <div className="bg-slate-200 p-6 rounded-full mb-4">
                        <Ship size={48} className="text-slate-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-500 mb-2">Sua foto aparecerá aqui</h3>
                      <p className="text-slate-400 text-sm max-w-xs">Preencha os dados ao lado para gerar sua imagem exclusiva no navio.</p>
                    </div>
                  )}
               </div>
             )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Cruzeiro Os Milionários. Todos os direitos reservados.</p>
          <p className="text-xs mt-2 text-slate-600">Powered by Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;