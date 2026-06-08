import React from "react";
import { UserProfile } from "../types";

interface StatsViewProps {
  currentUser: UserProfile;
  statsSummary: {
    total: number;
    warnings: number;
    safe: number;
    avoidedChartData: any[];
  };
}

export const StatsView: React.FC<StatsViewProps> = ({
  currentUser,
  statsSummary,
}) => {
  return (
    <div className="p-3 space-y-3 select-none text-zinc-900 font-sans">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-zinc-950">Métricas Preventivas</h3>
        <p className="text-[10px] text-zinc-400 font-mono uppercase">Análisis Clínico Mensual</p>
      </div>

      {/* THREE KPI CELLS PANEL */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-white p-2 rounded-xl border border-zinc-200 text-center shadow-3xs">
          <span className="block text-[8px] uppercase font-bold text-zinc-400 leading-none">Análisis</span>
          <span className="block text-xl font-black text-zinc-900 mt-1 font-mono">{statsSummary.total}</span>
          <span className="block text-[7.5px] text-zinc-400 italic">ejecutados</span>
        </div>

        <div className="bg-red-50 p-2 rounded-xl border border-red-250 text-center shadow-3xs">
          <span className="block text-[8px] uppercase font-black text-red-500 leading-none">Rojos</span>
          <span className="block text-xl font-black text-red-600 mt-1 font-mono">{statsSummary.warnings}</span>
          <span className="block text-[7.5px] text-red-400 italic">peligros</span>
        </div>

        <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-250 text-center shadow-3xs">
          <span className="block text-[8px] uppercase font-black text-emerald-500 leading-none">Aptos</span>
          <span className="block text-xl font-black text-emerald-600 mt-1 font-mono">{statsSummary.safe}</span>
          <span className="block text-[7.5px] text-emerald-400 italic">seguros</span>
        </div>
      </div>

      {/* RATIO SCALE BAR COMPASS */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-[10.5px]">
          <span className="font-extrabold text-zinc-700">Cociente de Consumo Seguro</span>
          <span className="font-extrabold text-emerald-600 font-mono p-1 bg-emerald-50 border border-emerald-200 rounded">
            {statsSummary.total > 0 ? Math.round((statsSummary.safe / statsSummary.total) * 100) : 100}% de Éxito
          </span>
        </div>

        {/* Dual Color Progress Fill */}
        <div className="w-full bg-zinc-150 bg-zinc-200 h-1.5 rounded-full overflow-hidden flex">
          <div 
            className="bg-emerald-500 h-full transition-all" 
            style={{ width: `${statsSummary.total > 0 ? (statsSummary.safe / statsSummary.total) * 100 : 100}%` }}
          ></div>
          <div 
            className="bg-red-500 h-full transition-all" 
            style={{ width: `${statsSummary.total > 0 ? (statsSummary.warnings / statsSummary.total) * 100 : 0}%` }}
          ></div>
        </div>
        
        <p className="text-[8.5px] text-zinc-400 italic text-center">
          Verde = Alimentos Libres de Alérgeno. Rojo = Advertencias Críticas Prevenidas por el Sistema.
        </p>
      </div>

      {/* MOST VOIDED GAUGES */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200/80 shadow-sm space-y-2">
        <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-tight block">
          Evitaciones Recurrentes por Categoría:
        </span>

        <div className="space-y-2 max-h-[170px] overflow-y-auto pr-0.5">
          {statsSummary.avoidedChartData.map((data, idx) => {
            const scale = Math.min(100, Math.max(10, (data.avoidedCount / (statsSummary.total || 5)) * 100));
            return (
              <div key={data.id} className="space-y-1 text-xs">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-600 leading-none">
                  <span className="flex items-center gap-1">
                    <span className="font-mono text-zinc-400">{idx + 1}.</span>
                    <span>{data.name}</span>
                  </span>
                  <span className="font-black text-zinc-900 font-mono">{data.avoidedCount} evitamos</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? "bg-red-650" : idx === 1 ? "bg-amber-500" : "bg-zinc-500"
                    }`}
                    style={{ width: `${scale}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ISO RECOMMENDATION BOX */}
      <div className="bg-emerald-50 text-emerald-950 border border-emerald-250 rounded-lg p-3 text-[10px] space-y-1">
        <p className="font-bold flex items-center gap-1">💡 RECOMENDACIÓN CLÍNICA (ISO 25010):</p>
        <p className="leading-snug text-emerald-800">
          Estás previniendo alérgenos {statsSummary.avoidedChartData[0]?.name || "frecuentes"}. Recuerda compartir este reporte consultivo con tu nutriólogo o sistema asistencial para renovar tu stock de autoinyectores de adrenalina.
        </p>
      </div>

    </div>
  );
};
