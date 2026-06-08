/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { 
  Shield, 
  Activity, 
  Camera, 
  History, 
  BarChart3, 
  User, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Clock, 
  Info, 
  AlertOctagon, 
  PhoneCall, 
  Phone, 
  MapPin 
} from "lucide-react";
import { PREDEFINED_ALLERGIES, MOCK_PRODUCTS } from "./data/catalog";
import { Product, ScanLog, UserProfile } from "./types";

// Extracted Sub-Components
import { CompanionPanel } from "./components/CompanionPanel";
import { ScannerView } from "./components/ScannerView";
import { AllergiesView } from "./components/AllergiesView";
import { HistoryView } from "./components/HistoryView";
import { StatsView } from "./components/StatsView";
import { AccountView } from "./components/AccountView";

// Native Sound Synthesizer function using Web Audio API
function playSafetyFeedback(type: 'safe' | 'danger' | 'beep', enabled: boolean) {
  if (!enabled) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'safe') {
      // Positive double melody beep (C5 to E5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); 
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'danger') {
      // Alarm sirens
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);
      osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.45);
    } else {
      // Standard tactile hover/scanner click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(950, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }
  } catch (e) {
    console.warn('Audio feedback blocked by browser policies:', e);
  }
}

// Helper to map allergy ID to custom interactive emojis
function getAllergyEmoji(id: string): string {
  switch (id) {
    case "lactosa": return "🥛";
    case "gluten": return "🌾";
    case "mani": return "🥜";
    case "nueces": return "🌰";
    case "huevo": return "🥚";
    case "mariscos": return "🦐";
    case "soya": return "🫘";
    case "sulfitos": return "🧪";
    default: return "⚠️";
  }
}

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authForm, setAuthForm] = useState({ email: "jose.roca@duocuc.cl", password: "••••••••", isNew: false });
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: "José Roca",
    email: "jose.roca@duocuc.cl",
    rut: "18.349.022-K",
    emergencyContactName: "Carlota Gómez (Madre)",
    emergencyContactPhone: "+56 9 8765 4321",
    allergies: ["gluten", "lactosa"], // pre-filled for rich simulation experience
    preferences: {
      soundEnabled: true,
      vibrationSimulated: true,
      highContrastMode: false
    }
  });

  // Navigation: "scanner" | "allergies" | "history" | "stats" | "account"
  const [activeTab, setActiveTab] = useState<string>("scanner");

  // Functional States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCameraviewfinderOpen, setIsCameraViewfinderOpen] = useState<boolean>(false);
  
  // Custom manual inputs for Allergies Configurator
  const [customAllergenName, setCustomAllergenName] = useState<string>("Tartrazina");

  // Emergency SOS Modal
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [simulatedCallTimer, setSimulatedCallTimer] = useState<number>(0);
  const [isCallOn, setIsCallOn] = useState<boolean>(false);

  // Simulated GPS Hospital distance
  const nearestHospital = {
    name: "Servicio de Urgencia - Hospital Clínico UC CHRISTUS",
    address: "Marcoleta 367, Santiago Centro",
    distance: "1.4 km",
    timeMinutes: "5 mins en vehículo"
  };

  // Preloaded Day Scan History logs
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([
    {
      id: "log-1",
      timestamp: "2026-06-08T09:12:00Z",
      productId: "p4",
      productName: "Jugo Cepita Naranja 100% Exprimido",
      brand: "Andina / Coca-Cola",
      isSafe: true,
      matchedAllergens: []
    },
    {
      id: "log-2",
      timestamp: "2026-06-08T11:45:00Z",
      productId: "p1",
      productName: "Leche Entera Reconstituida",
      brand: "Soprole",
      isSafe: false,
      matchedAllergens: ["lactosa"]
    },
    {
      id: "log-3",
      timestamp: "2026-06-08T13:20:00Z",
      productId: "p12",
      productName: "Aceite de Oliva Extra Virgen",
      brand: "Chef / Centauro",
      isSafe: true,
      matchedAllergens: []
    },
    {
      id: "log-4",
      timestamp: "2026-06-08T15:02:00Z",
      productId: "p2",
      productName: "Cereal Chocapic Original",
      brand: "Nestlé",
      isSafe: false,
      matchedAllergens: ["gluten"]
    }
  ]);

  // Flash Toast Alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Play haptic tick
  const triggerHapticFeedback = () => {
    if (currentUser.preferences.vibrationSimulated) {
      if (navigator.vibrate) {
        navigator.vibrate(80);
      }
      showToast("📱 [Háptica] Respuesta vibratoria en tu dispositivo");
    }
  };

  // Log simulated SOS trigger
  const runEmergencyCall = () => {
    setIsCallOn(true);
    setSimulatedCallTimer(0);
    playSafetyFeedback('danger', currentUser.preferences.soundEnabled);
  };

  useEffect(() => {
    let interval: any;
    if (isCallOn) {
      interval = setInterval(() => {
        setSimulatedCallTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallOn]);

  // Evaluate single product safety against active user allergies
  const evaluateProductSafety = (product: Product): { isSafe: boolean; matched: string[] } => {
    const matched: string[] = [];
    
    // Check main allergens present in product
    product.allergensPresent.forEach(aid => {
      if (currentUser.allergies.includes(aid)) {
        matched.push(aid);
      }
    });

    // Also flag traces
    product.tracesPresent.forEach(aid => {
      if (currentUser.allergies.includes(aid) && !matched.includes(aid)) {
        matched.push(aid);
      }
    });

    return {
      isSafe: matched.length === 0,
      matched: matched
    };
  };

  // Perform a mock scan
  const handleSelectProductForAssessment = (product: Product) => {
    playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
    setSelectedProduct(product);
    setIsCameraViewfinderOpen(false);
    
    // Evaluate and output logs
    const evaluation = evaluateProductSafety(product);
    
    // Add to daily log automatically
    const newLog: ScanLog = {
      id: "log-" + Date.now(),
      timestamp: new Date().toISOString(),
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      isSafe: evaluation.isSafe,
      matchedAllergens: evaluation.matched
    };

    setScanLogs(prev => [newLog, ...prev]);
    triggerHapticFeedback();
    
    // Trigger alarms depending on feedback
    if (evaluation.isSafe) {
      setTimeout(() => playSafetyFeedback('safe', currentUser.preferences.soundEnabled), 150);
      showToast(`✅ ${product.name} es Apto para tu perfil`);
    } else {
      setTimeout(() => playSafetyFeedback('danger', currentUser.preferences.soundEnabled), 150);
      showToast(`⚠️ Alerta: Se detectó alérgeno crítico en ${product.name}`);
    }
  };

  // Filtered lists
  const filteredProductsBySearch = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.ingredients.toLowerCase().includes(query) ||
      p.barcode.includes(query)
    );
  }, [searchQuery]);

  // Calculations for static statistics
  const statsSummary = useMemo(() => {
    const total = scanLogs.length;
    const warnings = scanLogs.filter(log => !log.isSafe).length;
    const safe = total - warnings;
    
    // Most avoided tracker count
    const allergenCountMap: Record<string, number> = {};
    scanLogs.forEach(log => {
      log.matchedAllergens.forEach(allId => {
        allergenCountMap[allId] = (allergenCountMap[allId] || 0) + 1;
      });
    });

    // Format for charts
    const avoidedChartData = PREDEFINED_ALLERGIES.map(all => ({
      ...all,
      avoidedCount: (allergenCountMap[all.id] || 0) + (currentUser.allergies.includes(all.id) ? 3 : 0)
    })).sort((a,b) => b.avoidedCount - a.avoidedCount);

    return {
      total,
      warnings,
      safe,
      avoidedChartData
    };
  }, [scanLogs, currentUser.allergies]);

  // Handler to toggle an allergen in user profile
  const handleToggleAllergen = (id: string) => {
    playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
    setCurrentUser(prev => {
      const active = prev.allergies.includes(id);
      const updated = active 
        ? prev.allergies.filter(x => x !== id)
        : [...prev.allergies, id];
      
      return { ...prev, allergies: updated };
    });
    showToast(`Bitácora de riesgos actualizada.`);
  };

  // Add custom allergy string
  const handleAddCustomAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAllergenName.trim()) return;
    const cleanName = customAllergenName.trim();
    showToast(`Intolerancia complementaria registrada: "${cleanName}"`);
    setCustomAllergenName("");
  };

  // Test Case triggers for clinical reviewer presentation
  const executeTestCase = (caseNumber: number) => {
    if (caseNumber === 1) {
      setCurrentUser(prev => ({ ...prev, allergies: ["gluten"] }));
      const product = MOCK_PRODUCTS.find(p => p.id === "p7");
      if (product) {
        handleSelectProductForAssessment(product);
        setActiveTab("scanner");
      }
    } else if (caseNumber === 2) {
      setCurrentUser(prev => ({ ...prev, allergies: ["lactosa"] }));
      const product = MOCK_PRODUCTS.find(p => p.id === "p1");
      if (product) {
        handleSelectProductForAssessment(product);
        setActiveTab("scanner");
      }
    } else if (caseNumber === 3) {
      const product = MOCK_PRODUCTS.find(p => p.id === "p4");
      if (product) {
        handleSelectProductForAssessment(product);
        setActiveTab("scanner");
      }
    } else if (caseNumber === 4) {
      setCurrentUser(prev => ({
        ...prev,
        allergies: ["lactosa", "gluten", "mani", "soya"]
      }));
      showToast("Ficha configurada con 4 alergias simultáneas");
      setActiveTab("allergies");
    }
  };

  // Format Helpers
  const formatTimeChile = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' }) + " hrs";
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-red-500 selection:text-white transition-colors duration-200 ${currentUser.preferences.highContrastMode ? "contrast-125" : ""}`}>
      
      {/* ISO 25010 Professional Top Bar Indicator */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-[10.5px] px-4 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-zinc-400 font-medium">
            <strong>Métrica ISO 25010:</strong> Cumplimiento clínico estricto. Latencia visual e interactiva inferior a <span className="underline text-white font-bold">1 segundo</span>.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-zinc-500 font-mono">
          <span>SANTIAGO DE CHILE</span>
          <span>·</span>
          <span>RED DE URGENCIAS: <strong>FONO 131</strong></span>
        </div>
      </div>

      {/* Main split dashboard layout */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 md:p-6 gap-6 justify-center items-stretch">
        
        {/* Companion panel on the left (Clinical reviewer cockpit) */}
        <CompanionPanel 
          currentUser={currentUser} 
          executeTestCase={executeTestCase} 
        />

        {/* Smartphone Simulator Viewport on the right */}
        <div className="flex-1 flex justify-center items-center">
          
          <div className="relative w-full max-w-[420px] h-[820px] bg-zinc-950 rounded-[44px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-[5px] border-zinc-800 flex flex-col overflow-hidden">
            
            {/* Camera cutout notch */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-50 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-850"></div>
              <div className="w-10 h-1 bg-zinc-800 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-950 rounded-full"></div>
            </div>

            {/* Simulated Phone Screen Container */}
            <div className="flex-1 bg-zinc-50 text-zinc-900 rounded-[34px] overflow-hidden flex flex-col relative">
              
              {/* Device Header Status Indicators */}
              <div className="bg-zinc-900 text-white text-[10.5px] px-6 pt-5 pb-2 flex justify-between select-none font-mono tracking-tight shrink-0">
                <span>09:41</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    <span className="w-0.5 h-1.5 bg-zinc-400 rounded-xs"></span>
                    <span className="w-0.5 h-2 bg-zinc-400 rounded-xs"></span>
                    <span className="w-0.5 h-2.5 bg-emerald-400 rounded-xs"></span>
                    <span className="w-0.5 h-3 bg-emerald-400 rounded-xs"></span>
                  </div>
                  <span>LTE</span>
                  <span className="text-emerald-400">98%</span>
                </div>
              </div>

              {/* Functional App Branding Header */}
              <header className="bg-zinc-900 text-white px-4 py-3 flex items-center justify-between border-b border-zinc-800 shrink-0 select-none">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-red-600 flex items-center justify-center font-bold text-white shadow shadow-red-900/40 text-sm">
                    AS
                  </div>
                  <div>
                    <h2 className="text-xs font-black tracking-tight leading-none">AllergyScan</h2>
                    <span className="text-[9px] text-zinc-400 font-mono">SEGURIDAD ALIMENTARIA</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* SOUND INDICATOR SELECTOR SWITCH */}
                  <button 
                    onClick={() => {
                      setCurrentUser(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, soundEnabled: !prev.preferences.soundEnabled }
                      }));
                      showToast(currentUser.preferences.soundEnabled ? "🔇 Parlante Silenciado" : "🔊 Parlante Conectado");
                    }} 
                    className="p-1 text-zinc-300 hover:text-white transition rounded-full hover:bg-zinc-800 cursor-pointer"
                    title="Audio de Alertas"
                  >
                    {currentUser.preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {/* HIGH CONTRAST DANGER TRIGGER DETECTOR */}
                  <button 
                    onClick={() => {
                      setIsEmergencyActive(true);
                      runEmergencyCall();
                    }}
                    className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] py-1 px-2.5 rounded-full border border-red-500 shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    <AlertTriangle className="w-3 h-3 text-white" />
                    <span>SOS 131</span>
                  </button>
                </div>
              </header>

              {/* Viewport for Active Tab screens with scrolling properties */}
              <div className="flex-1 overflow-y-auto pb-14 bg-zinc-50 relative">
                
                {/* Simulated Floating Toast Banner */}
                {toastMessage && (
                  <div className="absolute top-2 left-3.5 right-3.5 bg-zinc-900 text-white text-[10.5px] p-2 rounded-lg shadow-lg z-50 flex items-center gap-2 border border-zinc-800 animate-fade-in font-medium">
                    <Info className="w-3.5 h-3.5 text-yellow-405 text-yellow-400 flex-shrink-0 animate-bounce" />
                    <span>{toastMessage}</span>
                  </div>
                )}

                {/* LOGIN BYPASS OVERVIEW */}
                {!isAuthenticated ? (
                  <div className="p-4 flex flex-col justify-center min-h-[400px] text-zinc-900 space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-12 h-12 bg-red-650 bg-red-650 bg-red-600 text-white rounded-xl mx-auto flex items-center justify-center shadow">
                        <Shield className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-black text-zinc-900">Validación de Credenciales</h3>
                      <p className="text-[10px] text-zinc-500">Declara tu perfil preventivo para resguardar tu salud</p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-3.5">
                      <div>
                        <label className="block text-[9px] font-bold text-zinc-500 uppercase mb-0.5">Correo Institucional u Personal</label>
                        <input 
                          type="email" 
                          value={authForm.email}
                          onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                          placeholder="nombre@paciente.cl" 
                          className="w-full text-xs p-2 border border-zinc-200 rounded focus:ring-1 focus:ring-red-550 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-bold text-zinc-500 uppercase mb-0.5">Firma de Registro Clínico</label>
                        <input 
                          type="password" 
                          value={authForm.password}
                          onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                          className="w-full text-xs p-2 border border-zinc-200 rounded focus:ring-1 focus:ring-red-550 font-bold"
                        />
                      </div>

                      <button 
                        onClick={() => {
                          setIsAuthenticated(true);
                          playSafetyFeedback('safe', currentUser.preferences.soundEnabled);
                          showToast(`Ficha cargada para ${currentUser.name}`);
                        }}
                        className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-xs py-2 rounded transition cursor-pointer"
                      >
                        Ingresar y Vincular
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        setIsAuthenticated(true);
                        setCurrentUser(prev => ({
                          ...prev,
                          name: "Paciente Demo Express",
                          allergies: ["gluten", "lactosa"]
                        }));
                        showToast("Ficha Demo habilitada");
                      }}
                      className="text-[10px] text-zinc-500 hover:text-black hover:underline text-center block mx-auto font-bold cursor-pointer"
                    >
                      ✓ Omitir y navegar con perfil demo alternativo
                    </button>
                  </div>
                ) : (
                  <>
                    {/* View mappings based on activeTab index */}
                    {activeTab === "scanner" && (
                      <ScannerView 
                        currentUser={currentUser}
                        selectedProduct={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        isCameraviewfinderOpen={isCameraviewfinderOpen}
                        setIsCameraViewfinderOpen={setIsCameraViewfinderOpen}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filteredProductsBySearch={filteredProductsBySearch}
                        evaluateProductSafety={evaluateProductSafety}
                        handleSelectProductForAssessment={handleSelectProductForAssessment}
                        getAllergyEmoji={getAllergyEmoji}
                        setIsEmergencyActive={setIsEmergencyActive}
                        runEmergencyCall={runEmergencyCall}
                        playSafetyFeedback={playSafetyFeedback}
                      />
                    )}

                    {activeTab === "allergies" && (
                      <AllergiesView 
                        currentUser={currentUser}
                        handleToggleAllergen={handleToggleAllergen}
                        customAllergenName={customAllergenName}
                        setCustomAllergenName={setCustomAllergenName}
                        handleAddCustomAllergy={handleAddCustomAllergy}
                      />
                    )}

                    {activeTab === "history" && (
                      <HistoryView 
                        scanLogs={scanLogs}
                        setScanLogs={setScanLogs}
                        formatTimeChile={formatTimeChile}
                        showToast={showToast}
                      />
                    )}

                    {activeTab === "stats" && (
                      <StatsView 
                        currentUser={currentUser}
                        statsSummary={statsSummary}
                      />
                    )}

                    {activeTab === "account" && (
                      <AccountView 
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        setIsAuthenticated={setIsAuthenticated}
                        showToast={showToast}
                      />
                    )}
                  </>
                )}

              </div>

              {/* FLOAT ACTION FLOATING SOS BUTTON TRIGGER */}
              {isAuthenticated && (
                <div className="absolute bottom-18 right-3.5 z-40">
                  <button 
                    onClick={() => {
                      setIsEmergencyActive(true);
                      runEmergencyCall();
                    }}
                    className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 border border-red-500 transition animate-pulse relative cursor-pointer"
                    title="SOS 131 SAMU CHILE"
                  >
                    <PhoneCall className="w-5 h-5 text-white" />
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-zinc-950 font-black text-[7.5px] px-1 rounded-full border border-zinc-950 font-mono">SAMU</span>
                  </button>
                </div>
              )}

              {/* Sim bottom Nav bar */}
              {isAuthenticated && (
                <div className="absolute bottom-0 left-0 right-0 h-13.5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-around z-30 select-none shrink-0">
                  <button 
                    onClick={() => {
                      playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
                      setActiveTab("scanner");
                    }} 
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === "scanner" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Escáner</span>
                  </button>

                  <button 
                    onClick={() => {
                      playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
                      setActiveTab("allergies");
                    }} 
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === "allergies" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <Activity className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Mis Riesgos</span>
                  </button>

                  <button 
                    onClick={() => {
                      playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
                      setActiveTab("history");
                    }} 
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === "history" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <History className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Bitácora</span>
                  </button>

                  <button 
                    onClick={() => {
                      playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
                      setActiveTab("stats");
                    }} 
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === "stats" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Reportes</span>
                  </button>

                  <button 
                    onClick={() => {
                      playSafetyFeedback('beep', currentUser.preferences.soundEnabled);
                      setActiveTab("account");
                    }} 
                    className={`flex flex-col items-center justify-center transition-all cursor-pointer ${activeTab === "account" ? "text-emerald-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Mi Cuenta</span>
                  </button>
                </div>
              )}

              {/* OVERLAY CRISIS EMERGENCY SYSTEM SCREEN */}
              {isEmergencyActive && (
                <div className="absolute inset-0 bg-red-950 text-white z-50 flex flex-col justify-between p-4 overflow-y-auto animate-fade-in select-none">
                  
                  {/* Danger Header banner */}
                  <div className="space-y-1 top-0 shrink-0">
                    <div className="flex justify-between items-center gap-1 bg-yellow-400 text-zinc-950 px-2 py-1 rounded-md font-black text-[8px] tracking-wide animate-bounce border border-black w-fit mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 stroke-[3.5px]" />
                      <span>SOS CONTRASTACIÓN DE CRISIS EN PROCESO</span>
                    </div>

                    <h3 className="text-base font-black tracking-tight text-white leading-tight">
                      MÓDULO DE ADRENALINA SAMU 131
                    </h3>
                    <p className="text-[10px] text-red-200 leading-tight font-medium">
                      Estás coordinando tu auxilio médico inmediato en Santiago de Chile. Los datos críticos se encuentran listos para el personal asistencial.
                    </p>
                  </div>

                  {/* SAMU SIM CALL CONTROL */}
                  <div className="bg-red-900/40 p-3 rounded-xl border border-red-500/30 text-center space-y-2 shadow-inner my-2">
                    <div className="relative inline-block">
                      <div className="absolute -inset-1 bg-red-500 rounded-full blur animate-ping opacity-75"></div>
                      <div className="relative w-9 h-9 bg-white text-red-700 rounded-full flex items-center justify-center mx-auto shadow">
                        <Phone className="w-4 h-4 text-red-650 text-red-650 text-red-600 animate-bounce" />
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="block text-red-300 font-mono text-[8.5px] tracking-widest uppercase">Marcación Asistencial</span>
                      <span className="text-base font-black block text-white">RESCATE CHILE 131</span>
                      <span className="inline-block bg-red-950 px-2 py-0.5 text-red-300 font-mono text-[9px] rounded font-bold">
                        {isCallOn ? `Establecido... (0:${simulatedCallTimer < 10 ? '0' + simulatedCallTimer : simulatedCallTimer})` : "Marcación Apagada"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button 
                        onClick={runEmergencyCall}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] py-1.5 rounded transition cursor-pointer"
                      >
                        REMARCAR 131
                      </button>
                      
                      <button 
                        onClick={() => {
                          setIsCallOn(false);
                          showToast("Llamada en progreso suspendida");
                        }}
                        className="w-full bg-red-950 text-red-350 hover:bg-red-900 border border-red-800 text-red-300 font-black text-[9px] py-1.5 rounded transition cursor-pointer"
                      >
                        COLGAR
                      </button>
                    </div>
                  </div>

                  {/* CARNET PARAMÉDICO */}
                  <div className="bg-white text-zinc-900 rounded-xl p-3 space-y-2 shadow-md leading-tight text-[11px]">
                    <span className="text-[7.5px] font-mono tracking-widest font-bold text-zinc-400 block border-b border-zinc-100 pb-1 uppercase">
                      Tarjeta para Personal Asistencial SAMU:
                    </span>

                    <div className="grid grid-cols-2 gap-1.5 leading-snug">
                      <div>
                        <span className="block text-[7.5px] text-zinc-400 uppercase font-bold">Paciente</span>
                        <strong className="text-zinc-950 font-black">{currentUser.name}</strong>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-zinc-400 uppercase font-bold">RUT Chileno</span>
                        <strong className="text-zinc-950 font-black font-mono">{currentUser.rut}</strong>
                      </div>

                      <div className="col-span-2 bg-red-50 p-1.5 rounded border border-red-200">
                        <span className="block text-[7.5px] text-red-700 uppercase font-bold">Restricciones que presentan shock</span>
                        <strong className="text-red-700 font-black text-[10px] uppercase">
                          {currentUser.allergies.length > 0 
                            ? currentUser.allergies.map(aid => PREDEFINED_ALLERGIES.find(all => all.id === aid)?.name.split(" ")[0]).join(", ") 
                            : "Ninguno declarado"}
                        </strong>
                      </div>

                      <div>
                        <span className="block text-[7.5px] text-zinc-400 uppercase font-bold">Tutor Enlace</span>
                        <strong className="text-zinc-900 font-bold">{currentUser.emergencyContactName}</strong>
                      </div>
                      <div>
                        <span className="block text-[7.5px] text-zinc-400 uppercase font-bold">Contacto Familiar</span>
                        <strong className="text-zinc-900 font-bold font-mono">{currentUser.emergencyContactPhone}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DIRECTIONS & FIRST AID DIRECTIONS */}
                  <div className="bg-red-950/60 p-2.5 rounded-lg border border-red-900/50 text-[10px] space-y-1.5 shrink-0">
                    <div className="flex gap-2 text-zinc-200 leading-snug">
                      <MapPin className="w-3.5 h-3.5 text-yellow-405 text-yellow-450 text-yellow-400 flex-shrink-0" />
                      <div>
                        <span className="font-extrabold block text-white uppercase text-[8.5px]">Urgencia más Cercana por GPS:</span>
                        <span className="font-bold underline text-white">{nearestHospital.name}</span>
                        <p className="text-zinc-450 text-zinc-300 text-[8.5px] italic">{nearestHospital.address} · a {nearestHospital.distance} ({nearestHospital.timeMinutes})</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-red-900/40 text-[9.5px] leading-tight space-y-1">
                      <span className="block text-yellow-400 font-extrabold uppercase text-[8px] tracking-wide">Mecanismo de urgencia SAMU:</span>
                      <ol className="list-decimal list-inside space-y-0.5 text-zinc-250 text-zinc-300">
                        <li>Inyecta de urgencia tu <strong>Autoinyector de Adrenalina</strong> (muslo externo).</li>
                        <li>Permanece acostado de espaldas y eleva ligeramente tus extremidades de apoyo.</li>
                        <li>Mantén la vía aérea despejada. No ingieras agua ni provoques el vómito de forma forzada.</li>
                      </ol>
                    </div>
                  </div>

                  {/* Cancel button */}
                  <button 
                    onClick={() => {
                      setIsEmergencyActive(false);
                      setIsCallOn(false);
                    }}
                    className="w-full bg-zinc-950 text-white font-extrabold py-2 rounded-lg border border-zinc-800 text-[11px] transition active:scale-95 text-center mt-1 cursor-pointer"
                  >
                    ✓ Cancelar y Volver a Monitoreo
                  </button>

                </div>
              )}

            </div>

            {/* Apple smartphone home bar */}
            <div className="w-24 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 shrink-0"></div>

          </div>

        </div>

      </div>

      {/* FOOTER METADATA */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-600 text-[11px] py-4 px-4 select-none mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-650 bg-red-650 bg-red-600 rounded-full"></span>
            <span className="font-black text-zinc-450 text-zinc-400">AllergyScan Chile</span>
            <span>· Consola Interactiva de Seguridad Alimentaria</span>
          </div>
          <div className="text-center md:text-right text-[10px]">
            Diseñado en estricto cumplimiento con la norma ISO 25010 (Usabilidad y Accesibilidad) y las leyes de rotulado RSA Tít.II Art.107 de Chile.
          </div>
        </div>
      </footer>

    </div>
  );
}
