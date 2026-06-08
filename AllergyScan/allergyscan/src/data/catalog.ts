/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Allergy, Product } from "../types";

export const PREDEFINED_ALLERGIES: Allergy[] = [
  {
    id: "lactosa",
    name: "Lactosa y Lácteos",
    description: "Leche bovina, caseína, suero de leche, queso, yogurt o mantequilla.",
    chileanLabel: "Leche y derivados lácteos",
    icon: "Milk",
    commonIngredients: ["leche", "suero", "caseina", "lactosa", "crema", "mantequilla", "queso", "yogurt", "lácteo"]
  },
  {
    id: "gluten",
    name: "Gluten y Trigo",
    description: "Trigo, avena, centeno, cebada y productos derivados de harinas refinadas o integrales.",
    chileanLabel: "Gluten (trigo, cebada, centeno, avena)",
    icon: "Wheat",
    commonIngredients: ["trigo", "centeno", "cebada", "avena", "gluten", "harina de trigo", "semola", "malta"]
  },
  {
    id: "mani",
    name: "Maní / Cacahuates",
    description: "Maní tostado, mantequilla de maní, aceites prensados y trazas indirectas en repostería.",
    chileanLabel: "Maní y productos derivados",
    icon: "Nut",
    commonIngredients: ["mani", "maní", "cacahuate", "arachis", "mantequilla de mani"]
  },
  {
    id: "nueces",
    name: "Frutos de Árbol",
    description: "Almendras, nueces, avellanas, pistachos, castañas de cajú y productos derivados.",
    chileanLabel: "Nueces y frutos secos derivados",
    icon: "Shell",
    commonIngredients: ["almendra", "nuez", "nueces", "avellana", "pistacho", "castaña", "caju", "arándano silvestre procesado"]
  },
  {
    id: "huevo",
    name: "Huevo",
    description: "Yema de huevo, clara, albúmina, lecitina de huevo, mayonesas y horneados.",
    chileanLabel: "Huevo y derivados",
    icon: "Egg",
    commonIngredients: ["huevo", "yema", "clara", "albúmina", "albumina", "lecitina de huevo", "ovomucina"]
  },
  {
    id: "mariscos",
    name: "Mariscos y Pescados",
    description: "Crustáceos (camarón, jaiba), moluscos (almejas, choritos) y pescados (atún, salmón).",
    chileanLabel: "Pescados, crustáceos y moluscos",
    icon: "Fish",
    commonIngredients: ["atun", "atún", "salmon", "salmón", "pescado", "camaron", "camarón", "jaiba", "chorito", "almeja", "marisco", "crustaceo", "molusco"]
  },
  {
    id: "soya",
    name: "Soya",
    description: "Porotos de soya, lecitina de soya, proteína aislada, salsa de soya y tofu.",
    chileanLabel: "Soya y productos derivados",
    icon: "Bean",
    commonIngredients: ["soya", "soja", "lecitina de soya", "lecitina de soja", "tofu"]
  },
  {
    id: "sulfitos",
    name: "Sulfitos",
    description: "Conservantes químicos usualmente en vinos, frutos secos deshidratados y embutidos.",
    chileanLabel: "Sulfitos (en concentración superior a 10mg/kg)",
    icon: "FlaskConical",
    commonIngredients: ["sulfito", "metabisulfito", "dióxido de azufre", "dioxido de azufre", "e220", "e223"]
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    barcode: "7802100018273",
    name: "Leche Entera Reconstituida",
    brand: "Soprole",
    ingredients: "Leche fluida entera de vaca, fosfato fosfórico, vitaminas A y D. Libre de preservantes artificiales.",
    allergensPresent: ["lactosa"],
    tracesPresent: [],
    isSafeDefault: false,
    image: "🥛",
    chileanOctagons: [],
    allergenSummary: "Contiene Leche de vaca fluida natural (Lactosa pura)."
  },
  {
    id: "p2",
    barcode: "7802220193485",
    name: "Cereal Chocapic Original",
    brand: "Nestlé",
    ingredients: "Harina de trigo, azúcar, sémola de maíz, cacao en polvo, extracto de malta de cebada, sal, lecitina de soya, saborizante idéntico a natural.",
    allergensPresent: ["gluten", "soya"],
    tracesPresent: ["lactosa"],
    isSafeDefault: false,
    image: "🥣",
    chileanOctagons: ["ALTO EN AZÚCARES", "ALTO EN CALORÍAS"],
    allergenSummary: "Contiene gluten de trigo y cebada, y lecitina de soya. Puede contener trazas de leche."
  },
  {
    id: "p3",
    barcode: "7802520001091",
    name: "Chocolate con Almendras Sahne-Nuss",
    brand: "Nestlé",
    ingredients: "Azúcar, leche entera en polvo, manteca de cacao, almendras tostadas (15%), masa de cacao, suero de leche en polvo, lecitina de soya, ricinoleato de poliglicerol, esencia idéntica a natural.",
    allergensPresent: ["lactosa", "nueces", "soya"],
    tracesPresent: ["mani", "gluten"],
    isSafeDefault: false,
    image: "🍫",
    chileanOctagons: ["ALTO EN AZÚCARES", "ALTO EN GRASAS SATURADAS", "ALTO EN CALORÍAS"],
    allergenSummary: "Contiene derivados lácteos, almendras (nueces) y lecitina de soya. Elaborado en líneas con riesgo de maní y trigo."
  },
  {
    id: "p4",
    barcode: "7861005230911",
    name: "Jugo Cepita Naranja 100% Exprimido",
    brand: "Andina / Coca-Cola",
    ingredients: "Pure de jugo de naranja natural exprimido filtrado, ácido cítrico, vitamina C natural de la fruta.",
    allergensPresent: [],
    tracesPresent: [],
    isSafeDefault: true,
    image: "🍊",
    chileanOctagons: [],
    allergenSummary: "100% jugo de frutas naturales. Sin aditivos de alérgenos."
  },
  {
    id: "p5",
    barcode: "7801315124115",
    name: "Pan de Molde Blanco Familiar",
    brand: "Ideal",
    ingredients: "Harina de trigo enriquecida, agua, levadura de cerveza, azúcar, aceite de soya refinado, sal, gluten de trigo, propionato de calcio, monoglicéridos.",
    allergensPresent: ["gluten", "soya"],
    tracesPresent: ["lactosa"],
    isSafeDefault: false,
    image: "🍞",
    chileanOctagons: [],
    allergenSummary: "Contiene gluten de trigo y aceite de soya procesado. Puede contener trazas de leche por elaboración cruzada."
  },
  {
    id: "p6",
    barcode: "7802800539110",
    name: "Mayonesa Receta Artesanal",
    brand: "Hellmann's",
    ingredients: "Aceite de soya, agua, huevo entero, yema de huevo pasteurizada, vinagre de alcohol, azúcar, sal refinada, jugo de limón, EDTA, saborizante idéntico a natural.",
    allergensPresent: ["huevo", "soya"],
    tracesPresent: [],
    isSafeDefault: false,
    image: "🍶",
    chileanOctagons: ["ALTO EN GRASAS SATURADAS", "ALTO EN CALORÍAS"],
    allergenSummary: "Contiene huevo (yema/clara) y aceite de soya refinado."
  },
  {
    id: "p7",
    barcode: "7802000031150",
    name: "Fideos Spaghetti N°5",
    brand: "Carozzi",
    ingredients: "Sémola de trigo candeal de alta pureza sémol seleccionada, niacina, hierro, mononitrato de tiamina, riboflavina.",
    allergensPresent: ["gluten"],
    tracesPresent: ["huevo", "soya"],
    isSafeDefault: false,
    image: "🍝",
    chileanOctagons: [],
    allergenSummary: "Contiene gluten de trigo. Procesado en líneas que también procesan huevo."
  },
  {
    id: "p8",
    barcode: "7801040301139",
    name: "Atún Desmenuzado al Agua",
    brand: "Robinson Crusoe",
    ingredients: "Atún listado, agua purificada, sal refinada de mesa, pirofosfato de sodio para conservar textura.",
    allergensPresent: ["mariscos"],
    tracesPresent: [],
    isSafeDefault: false,
    image: "🐟",
    chileanOctagons: ["ALTO EN SODIO"],
    allergenSummary: "Contiene Pescado (Atún)."
  },
  {
    id: "p9",
    barcode: "7802140021028",
    name: "Discos de Empanadas Quillayes",
    brand: "Quillayes",
    ingredients: "Harina de trigo enriquecida, agua purificada, manteca de cerdo, sal, sorbato de potasio, ácido láctico, dióxido de azufre residual.",
    allergensPresent: ["gluten", "sulfitos"],
    tracesPresent: ["lactosa"],
    isSafeDefault: false,
    image: "🥟",
    chileanOctagons: [],
    allergenSummary: "Contiene trigo (gluten) y agentes sulfitos de conservación residual. Puede contener trazas de lácteos."
  },
  {
    id: "p10",
    barcode: "7802315891104",
    name: "Cereal Bar Crunch de Maní",
    brand: "Costa",
    ingredients: "Avena entera enrollada, jarabe de maltitol, maní seleccionado tostado (12%), arroz inflado, grasa vegetal de palma, chips sabor chocolate, sal de mesa, lecitina de soya.",
    allergensPresent: ["gluten", "mani", "soya"],
    tracesPresent: ["nueces", "lactosa"],
    isSafeDefault: false,
    image: "🌾",
    chileanOctagons: ["ALTO EN SODIO"],
    allergenSummary: "Contiene avena (gluten), maní tostado y lecitina de soya. Trazas de nueces de árbol y leche."
  },
  {
    id: "p11",
    barcode: "7801828011244",
    name: "Salsa de Soya Tradicional",
    brand: "Kikkoman",
    ingredients: "Agua purificada, trigo de molienda nacional, porotos enteros de soya desgrasada selecta, sal mineral, benzoato de sodio oxidante.",
    allergensPresent: ["gluten", "soya"],
    tracesPresent: [],
    isSafeDefault: false,
    image: "🧉",
    chileanOctagons: ["ALTO EN SODIO"],
    allergenSummary: "Contiene soya fermentada y trigo (gluten de fermentación)."
  },
  {
    id: "p12",
    barcode: "7803525114115",
    name: "Aceite de Oliva Extra Virgen",
    brand: "Chef / Centauro",
    ingredients: "Aceite puro de aceitunas chilenas seleccionadas obtenido por prensado hidráulico en frío.",
    allergensPresent: [],
    tracesPresent: [],
    isSafeDefault: true,
    image: "🫒",
    chileanOctagons: ["ALTO EN CALORÍAS"],
    allergenSummary: "100% puro aceite de oliva. Naturalmente libre de agentes alergénicos."
  },
  {
    id: "p13",
    barcode: "7801111222333",
    name: "Yoghurt Proteína Sabor Frutilla",
    brand: "Soprole Prot+",
    ingredients: "Leche descremada pasteurizada, concentrado de proteína de leche, gelatina, gelificante pectina, edulcorantes sucralosa y estevia, sorbato de potasio, fermentos lácticos específicos y pulpa de frutillas natural.",
    allergensPresent: ["lactosa"],
    tracesPresent: [],
    isSafeDefault: false,
    image: "🍓",
    chileanOctagons: [],
    allergenSummary: "Contiene leche de vaca concentrada (lactosa y proteínas lácteas)."
  }
];
