import React from "react";
import { Shield, ArrowRight, Phone } from "lucide-react";
import { UserProfile } from "../types";

interface CompanionPanelProps {
  currentUser: UserProfile;
  executeTestCase: (caseNumber: number) => void;
}

export const CompanionPanel: React.FC<CompanionPanelProps> = ({
  currentUser,
  executeTestCase,
}) => {
  return (
    <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col justify-between gap-4 bg-zinc-900 border border-zinc-850 rounded-2xl p-4 shadow-xl select-none">
      <div className="space-y-3">
        {/* Brand Header Group */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-500/10 text-red-500 rounded-lg border border-red-500/20">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-black text-base tracking-tight text-white flex items-center gap-1.5 leading-none">
              AllergyScan <span className="text-[9px] uppercase font-mono tracking-wider bg-red-600 text-white px-1 py-0.5 rounded-sm">CHILE v2.5</span>
            </h1>
            <p className="text-zinc-500 text-[10px] uppercase font-mono tracking-wide mt-0.5">Control de Prevención Alimentaria</p>
          </div>
        </div>

        {/* Quick Testing Instructions Block */}
        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-zinc-850 text-[11px] space-y-2.5">
          <span className="font-bold text-zinc-400 uppercase tracking-wider text-[9px] block border-b border-zinc-800 pb-1">
            🔍 CONSOLA DE PRUEBAS ISO 25010
          </span>
          <p className="text-zinc-400 leading-normal">
            Interactúa con el simulador móvil en el panel derecho. Usa los siguientes 
            <strong> accesos de simulación instantánea</strong> para evaluar el motor de contraste visual en menos de 1 segundo:
          </p>

          {/* Rapid Test Case Action Rows */}
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            <button 
              onClick={() => executeTestCase(1)}
              className="w-full text-left p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition text-zinc-300 flex items-center justify-between text-[11px] group"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-900/40 px-1.5 py-0.5 rounded-sm">CASE-01</span>
                <span className="font-medium text-zinc-300 group-hover:text-white">Gluten → Fideos Carozzi</span>
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button 
              onClick={() => executeTestCase(2)}
              className="w-full text-left p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition text-zinc-300 flex items-center justify-between text-[11px] group"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold bg-rose-950 text-rose-400 border border-rose-900/40 px-1.5 py-0.5 rounded-sm">CASE-02</span>
                <span className="font-medium text-zinc-300 group-hover:text-white">Lactosa → Leche Soprole</span>
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button 
              onClick={() => executeTestCase(3)}
              className="w-full text-left p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition text-zinc-300 flex items-center justify-between text-[11px] group"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-1.5 py-0.5 rounded-sm">CASE-03</span>
                <span className="font-medium text-zinc-300 group-hover:text-white">Apto → Jugo Cepita Naranja</span>
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button 
              onClick={() => executeTestCase(4)}
              className="w-full text-left p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg transition text-zinc-300 flex items-center justify-between text-[11px] group"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700/40 px-1.5 py-0.5 rounded-sm">CASE-04</span>
                <span className="font-medium text-zinc-300 group-hover:text-white">Configurar Alergias Múltiples</span>
              </span>
              <ArrowRight className="w-3 h-3 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Clinical Design Attributes */}
        <div className="space-y-1.5">
          <h2 className="text-[9px] uppercase font-mono font-bold text-zinc-500 tracking-wider">Principios ISO 25010 Aplicados:</h2>
          <div className="space-y-1.5 text-[10.5px]">
            <div className="flex gap-2 text-zinc-400">
              <span className="text-red-500 font-mono font-bold">1.</span>
              <span><strong className="text-zinc-300">Feedback Visual Instantáneo (0.3s):</strong> Respuesta cromática dual (Cód. Verde seguro vs Cód. Rojo peligro) que asiste al paciente con daltonismo.</span>
            </div>
            <div className="flex gap-2 text-zinc-400">
              <span className="text-red-500 font-mono font-bold">2.</span>
              <span><strong className="text-zinc-300">Localización Chilena (RSA):</strong> Mapeo de alérgenos bajo Ley de Etiquetados Alimentarios 20.606.</span>
            </div>
            <div className="flex gap-2 text-zinc-400">
              <span className="text-red-500 font-mono font-bold">3.</span>
              <span><strong className="text-zinc-300">Respuesta de Emergencia:</strong> Protocolo integrado de shock anafiláctico SAMU Red de Salud.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambulance & Emergencies Chile list */}
      <div className="mt-4 pt-3.5 border-t border-zinc-850 text-[11px] text-zinc-500">
        <div className="flex items-center gap-1.5 mb-2">
          <Phone className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-display font-bold text-rose-400 text-xs">Urgencias Médicas Nacionales (Chile)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[10.5px]">
          <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-850">
            <span className="block text-zinc-500 text-[9px] font-mono">AMBULANCIA CENTRAL SAMU</span>
            <span className="font-black text-white">Fono: 131</span>
          </div>
          <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-850">
            <span className="block text-zinc-500 text-[9px] font-mono">RESCATE BOMBEROS</span>
            <span className="font-black text-white">Fono: 132</span>
          </div>
        </div>
        <p className="mt-2 text-[9px] text-zinc-600 leading-snug">
          *Este software es un prototipo interactivo orientado a la validación clínica de interoperabilidad y usabilidad móvil.
        </p>
      </div>
    </div>
  );
};
