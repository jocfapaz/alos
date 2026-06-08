import React from "react";
import { History, Trash2, Check, X } from "lucide-react";
import { ScanLog, Product } from "../types";
import { MOCK_PRODUCTS } from "../data/catalog";

interface HistoryViewProps {
  scanLogs: ScanLog[];
  setScanLogs: React.Dispatch<React.SetStateAction<ScanLog[]>>;
  formatTimeChile: (iso: string) => string;
  showToast: (msg: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  scanLogs,
  setScanLogs,
  formatTimeChile,
  showToast,
}) => {
  return (
    <div className="p-3 space-y-3.5 select-none text-zinc-900 font-sans">
      <div className="flex justify-between items-center bg-zinc-50 p-1 border-b border-zinc-200">
        <div>
          <h3 className="text-sm font-bold text-zinc-950">Bitácora de Consumo</h3>
          <p className="text-[10px] text-zinc-400 font-mono uppercase">Historial del día</p>
        </div>
        <button 
          onClick={() => {
            setScanLogs([]);
            showToast("Bitácora de escaneos borrada.");
          }}
          className="text-[9.5px] text-red-650 font-black hover:underline cursor-pointer"
        >
          Limpiar Todo
        </button>
      </div>

      {scanLogs.length > 0 ? (
        <div className="space-y-1.5 max-h-[430px] overflow-y-auto pr-0.5">
          {scanLogs.map(log => {
            const prod = MOCK_PRODUCTS.find(p => p.id === log.productId);
            return (
              <div 
                key={log.id}
                className="bg-white rounded-lg p-2.5 border border-zinc-200 flex items-center justify-between gap-2.5 shadow-2xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center text-lg flex-shrink-0">
                    {prod?.image || "📦"}
                  </div>
                  <div className="truncate space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-zinc-805 text-zinc-800 text-xs truncate max-w-[120px]">{log.productName}</span>
                      <span className="text-[8px] text-zinc-400 font-mono flex-shrink-0">
                        {formatTimeChile(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-[9px] text-zinc-500 leading-none truncate">{log.brand}</p>
                    
                    {!log.isSafe && log.matchedAllergens.length > 0 && (
                      <span className="inline-block text-[8px] font-bold text-red-700 bg-red-100 border border-red-200 px-1 py-0.2 rounded uppercase">
                        Riesgo: {log.matchedAllergens.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {log.isSafe ? (
                    <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-1.5 rounded-full text-[10px] shadow-sm">
                      <Check className="w-3 h-3 text-emerald-700 stroke-[3.5px]" />
                    </span>
                  ) : (
                    <span className="bg-red-50 border border-red-300 text-red-800 p-1.5 rounded-full text-[10px] shadow-sm">
                      <X className="w-3 h-3 text-red-700 stroke-[3.5px]" />
                    </span>
                  )}
                  
                  <button 
                    onClick={() => {
                      setScanLogs(prev => prev.filter(x => x.id !== log.id));
                      showToast("Elemento eliminado de la bitácora");
                    }}
                    className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-650 cursor-pointer"
                    title="Remover escaneo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-7 rounded-xl border border-dashed border-zinc-300 text-center space-y-2">
          <History className="w-6 h-6 text-zinc-300 mx-auto" />
          <p className="text-[11px] text-zinc-505 font-bold text-zinc-600">Bitácora vacía para hoy</p>
          <p className="text-[9.5px] text-zinc-400 max-w-xs mx-auto">
            Realiza búsquedas o simulaciones en la pestaña "Escáner" para procesar productos.
          </p>
        </div>
      )}

      <div className="bg-zinc-900 text-zinc-200 p-3 rounded-lg text-center space-y-0.5 border border-zinc-850">
        <p className="font-bold text-[10.5px]">♻️ EXPORTACIÓN INTEGRADA</p>
        <p className="text-[9.5px] text-zinc-400 font-medium">
          Bitácora local compatible con protocolos clínicos de alergia para derivación a inmunólogos.
        </p>
      </div>
    </div>
  );
};
