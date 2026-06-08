/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Allergy {
  id: string;
  name: string; // e.g., "Maní", "Gluten", "Lactosa"
  description: string;
  chileanLabel: string; // Name of allergen as defined in Chilean RSA
  icon: string; // Lucide icon alias
  commonIngredients: string[]; // List of ingredient terms that trigger this allergy
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  ingredients: string; // Raw ingredient list
  allergensPresent: string[]; // List of allergy IDs present
  tracesPresent: string[]; // List of allergy IDs that might contain traces
  isSafeDefault: boolean;
  image: string; // Mock or custom styled icon/placeholder
  chileanOctagons?: ("ALTO EN AZÚCARES" | "ALTO EN GRASAS SATURADAS" | "ALTO EN SODIO" | "ALTO EN CALORÍAS")[];
  allergenSummary: string;
}

export interface ScanLog {
  id: string;
  timestamp: string; // e.g., "2026-06-08T15:30:00Z"
  productId: string;
  productName: string;
  brand: string;
  isSafe: boolean;
  matchedAllergens: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  rut: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  allergies: string[]; // allergy IDs
  preferences: {
    soundEnabled: boolean;
    vibrationSimulated: boolean;
    highContrastMode: boolean; // Accessible for color blinding under ISO 25010
  };
}
