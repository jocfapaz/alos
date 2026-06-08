import React from "react";
import { UserProfile } from "../types";
import { PREDEFINED_ALLERGIES } from "../data/catalog";

interface AllergiesViewProps {
  currentUser: UserProfile;
  handleToggleAllergen: (id: string) => void;
  customAllergenName: string;
  setCustomAllergenName: (val: string) => void;
  handleAddCustomAllergy: (e: React.FormEvent) => void;
}

export const AllergiesView: React.FC<AllergiesViewProps> = ({
  currentUser,
  handleToggleAllergen,
  customAllergenName,
  setCustomAllergenName,
  handleAddCustomAllergy,
}) => {
  return (
    <div className="p-3 space-y-3.5 select-none text-zinc-900 font-sans">
      <div className="space-y-0.5">
        <h3 className="text-sm font-bold text-zinc-950">Bitácora de Alérgenos</h3>
        <p className="text-[10.5px] text-zinc-550 leading-tight text-zinc-500">
          Declara tus factores de restricción para alertarte inmediatamente ante coincidencias químicas chilenas.
        </p>
      </div>

      {/* DENSE 2-COLUMN GRID ALLERGEN MATRIX SELECTOR */}
      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
        {PREDEFINED_ALLERGIES.map(all => {
          const isSelected = currentUser.allergies.includes(all.id);
          return (
            <button 
              key={all.id}
              onClick={() => handleToggleAllergen(all.id)}
              className={`text-left p-2 rounded-xl border transition flex flex-col justify-between h-24 relative overflow-hidden ${
                isSelected 
                  ? "bg-red-50 border-red-300 text-zinc-900" 
                  : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700"
              }`}
            >
              {/* Deuteranopia check strip indicators */}
              {isSelected && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-650 bg-red-600"></div>
              )}

              <div className="flex items-center justify-between w-full">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
                  isSelected ? "bg-red-200 text-red-700" : "bg-zinc-100 text-zinc-500"
                }`}>
                  {all.id === "lactosa" && "🥛"}
                  {all.id === "gluten" && "🌾"}
                  {all.id === "mani" && "🥜"}
                  {all.id === "nueces" && "🌰"}
                  {all.id === "huevo" && "🥚"}
                  {all.id === "mariscos" && "🦐"}
                  {all.id === "soya" && "🫘"}
                  {all.id === "sulfitos" && "🧪"}
                </div>
                {isSelected && (
                  <span className="text-[7.5px] font-mono tracking-wider font-extrabold bg-red-600 text-white px-1 py-0.5 rounded-sm">
                    ALERTA
                  </span>
                )}
              </div>

              <div className="space-y-0.5 mt-2">
                <span className="text-[11px] font-black tracking-tight leading-none block truncate">{all.name}</span>
                <span className="text-[9px] text-zinc-400 font-mono block italic truncate">{all.chileanLabel}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* COMPACT CUSTOM RISK FORM */}
      <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-3xs space-y-2">
        <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider block">Registrar intolerancia secundaria:</span>
        <form onSubmit={handleAddCustomAllergy} className="flex gap-1.5">
          <input 
            type="text" 
            value={customAllergenName}
            onChange={(e) => setCustomAllergenName(e.target.value)}
            placeholder="Ej: Tartrazina, canela, etc." 
            className="flex-1 text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded focus:ring-1 focus:ring-red-500 text-zinc-805 text-zinc-800 font-semibold"
          />
          <button 
            type="submit"
            className="bg-zinc-90 w-20 bg-zinc-900 text-white text-[10px] rounded font-bold hover:bg-zinc-800 transition"
          >
            Añadir
          </button>
        </form>
        <p className="text-[9px] text-zinc-400 font-medium">
          El motor AllergyScan monitorizará de forma secundaria las referencias del término en los ingredientes procesados.
        </p>
      </div>

    </div>
  );
};
