import React from "react";
import { LogOut } from "lucide-react";
import { UserProfile } from "../types";

interface AccountViewProps {
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setIsAuthenticated: (auth: boolean) => void;
  showToast: (msg: string) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  setCurrentUser,
  setIsAuthenticated,
  showToast,
}) => {
  return (
    <div className="p-3 space-y-3.5 select-none text-zinc-900 font-sans">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-zinc-950">Ajustes Clínicos</h3>
        <p className="text-[10px] text-zinc-400 font-mono uppercase">Perfil de Usuario y Accesibilidad</p>
      </div>

      {/* CHILE CLINICAL USER CARD */}
      <div className="bg-white rounded-xl p-3 border border-zinc-200/80 shadow-3xs space-y-2.5 text-xs">
        <span className="font-mono uppercase font-bold text-zinc-400 text-[8.5px] block border-b border-zinc-100 pb-1">
          Identificación Ficha Clínica:
        </span>
        
        <div className="space-y-2">
          <div>
            <label className="block text-[8.5px] text-zinc-500 font-bold mb-0.5 uppercase">Nombre Completo del Paciente</label>
            <input 
              type="text" 
              value={currentUser.name}
              onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
              className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-red-500 text-zinc-800 font-bold"
            />
          </div>

          <div>
            <label className="block text-[8.5px] text-zinc-500 font-bold mb-0.5 uppercase">RUT Chileno</label>
            <input 
              type="text" 
              value={currentUser.rut}
              onChange={(e) => setCurrentUser({...currentUser, rut: e.target.value})}
              className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-red-500 text-zinc-800 font-bold font-mono"
            />
          </div>

          <div>
            <label className="block text-[8.5px] text-zinc-500 font-bold mb-0.5 uppercase">Contacto de Urgencia (Tutor/Familiar)</label>
            <input 
              type="text" 
              value={currentUser.emergencyContactName}
              onChange={(e) => setCurrentUser({...currentUser, emergencyContactName: e.target.value})}
              className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-red-500 text-zinc-800 font-bold"
            />
          </div>

          <div>
            <label className="block text-[8.5px] text-zinc-500 font-bold mb-0.5 uppercase">Teléfono de Enlace de Emergencia</label>
            <input 
              type="text" 
              value={currentUser.emergencyContactPhone}
              onChange={(e) => setCurrentUser({...currentUser, emergencyContactPhone: e.target.value})}
              className="w-full px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:ring-1 focus:ring-red-500 text-zinc-800 font-bold font-mono"
            />
          </div>
        </div>
      </div>

      {/* ISO 25010 SWITCH ACCESSIBILITY PANEL */}
      <div className="bg-white rounded-xl p-3 border border-zinc-200/80 shadow-3xs space-y-3.5 text-xs">
        <span className="font-mono uppercase font-bold text-zinc-400 text-[8.5px] block border-b border-zinc-100 pb-1">
          Parámetros de Usabilidad Extrema (ISO 25010):
        </span>

        <div className="space-y-3 pt-0.5">
          {/* AUDIO FEEDBACK TOGGLE */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="font-extrabold text-zinc-700 block text-xs leading-none">Efectos de Alarma Auditiva</span>
              <span className="block text-[9px] text-zinc-400 leading-tight">Síntesis de audio para validaciones directas o peligros</span>
            </div>
            <button 
              onClick={() => {
                setCurrentUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, soundEnabled: !prev.preferences.soundEnabled }
                }));
                showToast(!currentUser.preferences.soundEnabled ? "🔊 Sonidos Activos" : "🔇 Sonidos Desactivados");
              }}
              className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${currentUser.preferences.soundEnabled ? "bg-emerald-500" : "bg-zinc-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${currentUser.preferences.soundEnabled ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          {/* SIMULATED VIBRATION TOGGLE */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="font-extrabold text-zinc-700 block text-xs leading-none">Vibración Háptica Física</span>
              <span className="block text-[9px] text-zinc-400 leading-tight">Gatilla pulsos simulados al detectar sustancias coincidentes</span>
            </div>
            <button 
              onClick={() => {
                setCurrentUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, vibrationSimulated: !prev.preferences.vibrationSimulated }
                }));
                showToast(!currentUser.preferences.vibrationSimulated ? "🎯 Háptica Activa" : "🚫 Háptica Desactivada");
              }}
              className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${currentUser.preferences.vibrationSimulated ? "bg-emerald-500" : "bg-zinc-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${currentUser.preferences.vibrationSimulated ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          {/* HIGH CONTRAST MODE */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="font-extrabold text-zinc-700 block text-xs leading-none">Contraste Clínico Compensado</span>
              <span className="block text-[9px] text-zinc-400 leading-tight">Patrones de alto contraste de color para deuteranopía</span>
            </div>
            <button 
              onClick={() => {
                setCurrentUser(prev => ({
                  ...prev,
                  preferences: { ...prev.preferences, highContrastMode: !prev.preferences.highContrastMode }
                }));
                showToast(!currentUser.preferences.highContrastMode ? "👁️ Alto Contraste Activo" : "👁️ Contraste Estándar");
              }}
              className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 cursor-pointer ${currentUser.preferences.highContrastMode ? "bg-emerald-500" : "bg-zinc-300"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${currentUser.preferences.highContrastMode ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* SESSION LOGOUT DISCONNECT TRIGGER */}
      <div className="pt-1.5">
        <button 
          onClick={() => {
            setIsAuthenticated(false);
          }}
          className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 border border-red-200/80 shadow-2xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Cerrar Sesión Preventiva (Desvincular RUT)</span>
        </button>
      </div>

    </div>
  );
};
