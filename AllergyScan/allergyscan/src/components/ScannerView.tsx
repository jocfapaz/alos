import React from "react";
import { 
  CheckCircle2, 
  AlertOctagon, 
  FileText, 
  Camera, 
  Search, 
  ArrowRight, 
  Clock, 
  Shield 
} from "lucide-react";
import { Product, UserProfile } from "../types";
import { PREDEFINED_ALLERGIES, MOCK_PRODUCTS } from "../data/catalog";

interface ScannerViewProps {
  currentUser: UserProfile;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isCameraviewfinderOpen: boolean;
  setIsCameraViewfinderOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredProductsBySearch: Product[];
  evaluateProductSafety: (product: Product) => { isSafe: boolean; matched: string[] };
  handleSelectProductForAssessment: (product: Product) => void;
  getAllergyEmoji: (id: string) => string;
  setIsEmergencyActive: (active: boolean) => void;
  runEmergencyCall: () => void;
  playSafetyFeedback: (type: 'safe' | 'danger' | 'beep', enabled: boolean) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({
  currentUser,
  selectedProduct,
  setSelectedProduct,
  isCameraviewfinderOpen,
  setIsCameraViewfinderOpen,
  searchQuery,
  setSearchQuery,
  filteredProductsBySearch,
  evaluateProductSafety,
  handleSelectProductForAssessment,
  getAllergyEmoji,
  setIsEmergencyActive,
  runEmergencyCall,
  playSafetyFeedback,
}) => {

  const activeAllergiesCount = currentUser.allergies.length;

  return (
    <div className="p-3 space-y-3 select-none text-zinc-900 font-sans">
      
      {/* High Density ISO Quick Alert Bar */}
      <div className="bg-zinc-900 border border-zinc-800 text-white rounded-xl p-2 flex items-center justify-between gap-1.5 shadow">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <p className="text-[10px] text-zinc-300 font-mono font-medium leading-none">
            CONTROL PREVENTIVO: <span className="text-emerald-400 font-extrabold">{activeAllergiesCount} ALERGIAS DECLARADAS</span>
          </p>
        </div>
        <span className="text-[9px] font-mono bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded-sm">0.3s LATENCY</span>
      </div>

      {/* RENDER PRODUCT EVALUATION SCREEN */}
      {selectedProduct && (() => {
        const evaluation = evaluateProductSafety(selectedProduct);
        return (
          <div className="space-y-2.5 animate-fade-in">
            {evaluation.isSafe ? (
              /* SAFETY BAR CARD */
              <div className="bg-emerald-50 text-emerald-950 rounded-xl p-3 border border-emerald-300 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-500"></div>
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 bg-white border border-emerald-200 rounded-lg flex items-center justify-center text-xl shadow-xs">
                    {selectedProduct.image}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <span className="text-[8px] font-mono uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded-sm font-black inline-block">
                      ✓ APTO PARA CONSUMO
                    </span>
                    <h3 className="text-sm font-bold tracking-tight text-emerald-950 leading-tight">{selectedProduct.name}</h3>
                    <p className="text-[10px] font-medium text-emerald-700">{selectedProduct.brand}</p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] leading-snug space-y-1">
                  <p className="font-extrabold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[3px]" />
                    0 COINCIDENCIAS CRÍTICAS DETECTADAS
                  </p>
                  <p className="text-emerald-800 font-medium bg-white/60 p-1.5 rounded border border-emerald-100">
                    Sustancias libres de tus {activeAllergiesCount} restricciones registradas.
                  </p>
                </div>

                <div className="mt-2 flex justify-end">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-[9.5px] bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-1 px-2.5 rounded-md transition"
                  >
                    Cerrar y Analizar Otro
                  </button>
                </div>
              </div>
            ) : (
              /* DANGER ALERT BAR CARD */
              <div className="bg-red-50 text-red-950 rounded-xl p-3 border border-red-400 shadow-sm relative overflow-hidden animate-pulse">
                <div className="absolute top-0 right-0 left-0 h-1 bg-red-650"></div>
                <span className="text-[8px] font-mono tracking-wider font-black bg-yellow-400 text-neutral-900 px-1.5 py-0.5 rounded-sm block w-fit mb-2">
                  ⚠️ AMENAZA DE ALÉRGENO CRÍTICO
                </span>

                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 bg-red-900 text-white rounded-lg flex items-center justify-center text-xl shadow-xs">
                    🚫
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <span className="text-[8px] font-mono bg-red-600 text-white px-1.5 py-0.5 rounded-sm font-black inline-block uppercase">
                      Peligro de shock anafiláctico
                    </span>
                    <h3 className="text-sm font-bold tracking-tight text-red-950 leading-tight">{selectedProduct.name}</h3>
                    <p className="text-[10px] font-semibold text-red-800">{selectedProduct.brand}</p>
                  </div>
                </div>

                {/* DETECTED ALERGEN COLLISION TAGS */}
                <div className="mt-2.5 pt-2 border-t border-red-200/80 space-y-1.5 text-[11px]">
                  <p className="font-extrabold text-red-900">
                    Alérgenos coincidentes detectados:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {evaluation.matched.map(mid => {
                      const labelObj = PREDEFINED_ALLERGIES.find(all => all.id === mid);
                      return (
                        <span key={mid} className="bg-red-700 text-white border border-red-650 px-2 py-0.5 rounded font-black text-[10px] uppercase flex items-center gap-1 shadow-sm">
                          <span>{getAllergyEmoji(mid)}</span>
                          <span>{labelObj?.name || mid}</span>
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-red-800 bg-white/60 p-1.5 rounded border border-red-100 font-medium">
                    {selectedProduct.allergenSummary}
                  </p>
                </div>

                {/* BLACK CHILEAN WARNING SEALS */}
                {selectedProduct.chileanOctagons && selectedProduct.chileanOctagons.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[8px] font-mono font-bold text-zinc-500 uppercase block">Sellos Minsal Chile:</span>
                    <div className="flex gap-1.5">
                      {selectedProduct.chileanOctagons.map(octagon => (
                        <div key={octagon} className="bg-black text-white text-[7px] font-extrabold uppercase p-1 rounded border border-neutral-800 flex flex-col justify-center items-center h-10 w-10 text-center leading-2">
                          <span className="text-[6px] text-neutral-400">ALTO EN</span>
                          <span className="text-[7px] font-black">{octagon.split("ALTO EN ")[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DIRECT EMERGENCY RED BUTTON WITHIN ASSESSMENT BOX */}
                <div className="mt-3 pt-2.5 border-t border-red-200 flex items-center justify-between gap-1.5">
                  <button 
                    onClick={() => {
                      setIsEmergencyActive(true);
                      runEmergencyCall();
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[9.5px] py-1 px-2.5 rounded-md flex items-center gap-1 shadow-sm transition active:scale-95"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>Llamar SAMU Ambulancia (131)</span>
                  </button>

                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="text-[10px] text-zinc-600 hover:text-black font-semibold hover:underline"
                  >
                    Cerrar Alerta
                  </button>
                </div>
              </div>
            )}

            {/* RAW INGREDIENTS WITH HIGH CONTRAST HIGHLIGHTS */}
            <div className="bg-white rounded-xl p-3 border border-zinc-200 text-[11px] space-y-1.5">
              <span className="text-[9px] uppercase font-mono font-bold text-zinc-400 tracking-wider flex items-center gap-1 border-b border-zinc-100 pb-1">
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                Ingredientes Registrados:
              </span>
              <p className="text-zinc-700 leading-normal bg-zinc-50 p-2 rounded border border-zinc-100">
                {(() => {
                  let text = selectedProduct.ingredients;
                  PREDEFINED_ALLERGIES.forEach(category => {
                    if (currentUser.allergies.includes(category.id)) {
                      category.commonIngredients.forEach(term => {
                        const regex = new RegExp(`\\b(${term}\\w*)\\b`, 'gi');
                        text = text.replace(regex, `<b class="text-red-600 bg-red-50 border-b border-red-300 px-0.5">$1</b>`);
                      });
                    }
                  });
                  return <span dangerouslySetInnerHTML={{ __html: text }} />;
                })()}
              </p>
              <p className="text-[9px] text-zinc-400 italic">
                *Marcados en <span className="text-red-500 font-bold">rojo</span> los factores de riesgo de tu bitácora de alergias.
              </p>
            </div>
          </div>
        );
      })()}

      {/* MOCK SCAN CAMERA FRAME */}
      <div className="space-y-1.5">
        <button 
          onClick={() => {
            setIsCameraViewfinderOpen(!isCameraviewfinderOpen);
            playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
          }}
          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition border ${
            isCameraviewfinderOpen 
              ? "bg-zinc-900 border-zinc-800 text-white" 
              : "bg-red-600 hover:bg-red-700 text-white border-red-500"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{isCameraviewfinderOpen ? "Cerrar Lente de Cámara" : "Simular Escáner de Código de Barras"}</span>
        </button>

        {isCameraviewfinderOpen && (
          <div className="bg-zinc-950 rounded-xl p-3 text-white space-y-2.5 relative overflow-hidden border border-zinc-800">
            {/* Glowing scanline overlay */}
            <div className="absolute left-0 right-0 h-0.5 bg-red-500 opacity-80 shadow-[0_0_8px_#ef4444] animate-bounce" style={{ top: '45%' }}></div>

            <div className="flex justify-between items-center text-[9px] bg-zinc-900 px-2 py-1 rounded border border-zinc-800 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span>LENS CAM_ACTIVE</span>
              </span>
              <span>1080P FHD</span>
            </div>

            {/* Simulated frame */}
            <div className="w-full h-24 border border-dashed border-red-500/40 rounded bg-black/40 flex flex-col items-center justify-center text-center p-2">
              <Shield className="w-5 h-5 text-red-500 mb-1 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400">ENFOCA CÓDIGO PRODUCTO</span>
            </div>

            {/* DEMO FOCUS SELECTABLE CHIP LIST */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 block font-bold">Toca para enfocar cámara:</span>
              <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1">
                {MOCK_PRODUCTS.map(p => {
                  const safety = evaluateProductSafety(p);
                  return (
                    <button 
                      key={p.id}
                      onClick={() => handleSelectProductForAssessment(p)}
                      className="w-full text-left p-1.5 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 border border-zinc-850 rounded text-[10px] flex items-center justify-between"
                    >
                      <span className="truncate font-mono text-zinc-300 font-semibold">{p.image} {p.name}</span>
                      <span className={`text-[8px] font-mono px-1 rounded-sm ${safety.isSafe ? "bg-emerald-950 text-emerald-400" : "bg-rose-955 text-rose-450 text-red-300 bg-red-950"}`}>
                        {safety.isSafe ? "APTO" : "ALERTA"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMPACT PRODUCT SEARCH DIRECT ACTION SELECTOR */}
      <div className="bg-white rounded-xl p-3 border border-zinc-200/80 shadow-xs space-y-2">
        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Buscar código o marca en góndola:</label>
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ej: Soprole, Nestlé, fideos, Chocapic..." 
            className="w-full text-xs pl-8 pr-12 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 font-semibold text-zinc-900"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2 text-[10px] text-zinc-400 hover:text-black font-bold"
            >
              Borrar
            </button>
          )}
        </div>

        {searchQuery.trim() !== "" && (
          <div className="bg-zinc-50 p-1 rounded-lg border border-zinc-200/80 max-h-40 overflow-y-auto space-y-1">
            {filteredProductsBySearch.length > 0 ? (
              filteredProductsBySearch.map(p => (
                <button 
                  key={p.id}
                  onClick={() => {
                    handleSelectProductForAssessment(p);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-1.5 hover:bg-white rounded border border-transparent hover:border-zinc-200 flex items-center justify-between text-xs"
                >
                  <span className="truncate font-medium text-zinc-800">{p.image} {p.name} <span className="text-[10px] text-zinc-400 font-mono">({p.brand})</span></span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </button>
              ))
            ) : (
              <div className="text-center py-3 text-zinc-400 text-[11px]">
                Ninguna coincidencia simulada. Prueba "Soprole" o "Cepita".
              </div>
            )}
          </div>
        )}
      </div>

      {/* MINIFIED ALLERGIES STATUS FLAGS */}
      <div className="bg-zinc-100 rounded-xl p-2.5 border border-zinc-200 text-[10.5px] space-y-1">
        <span className="font-bold text-zinc-500 uppercase tracking-wider text-[9px] block">MIS FACTORES DECLARADOS ({activeAllergiesCount}):</span>
        <div className="flex flex-wrap gap-1">
          {currentUser.allergies.length > 0 ? (
            currentUser.allergies.map(aid => {
              const matchedAll = PREDEFINED_ALLERGIES.find(all => all.id === aid);
              return (
                <span key={aid} className="bg-white border border-zinc-250 text-zinc-700 text-[9.5px] px-1.5 py-0.5 rounded font-bold uppercase shadow-2xs">
                  {getAllergyEmoji(aid)} {matchedAll?.name.split(" ")[0] || aid}
                </span>
              );
            })
          ) : (
            <span className="text-rose-500 font-bold bg-white px-2 py-1 rounded border border-red-200">
              ⚠️ Alerta: Ninguna alergia seleccionada. Visita la pestaña "Mis Riesgos".
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
