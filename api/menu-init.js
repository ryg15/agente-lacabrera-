const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PLATOS = [
  // Cortes
  { plato: "Short Ribs 28oz", categoria: "Cortes", disponible: true },
  { plato: "Short Ribs 18oz", categoria: "Cortes", disponible: true },
  { plato: "New York Strip 21oz", categoria: "Cortes", disponible: true },
  { plato: "New York Strip 14oz", categoria: "Cortes", disponible: true },
  { plato: "Grand New York Strip 28oz", categoria: "Cortes", disponible: true },
  { plato: "New York Strip con queso azul 14oz", categoria: "Cortes", disponible: true },
  { plato: "Outside Skirt 21oz", categoria: "Cortes", disponible: true },
  { plato: "Outside Skirt 14oz", categoria: "Cortes", disponible: true },
  { plato: "Ribeye CAB 21oz", categoria: "Cortes", disponible: true },
  { plato: "Ribeye CAB 14oz", categoria: "Cortes", disponible: true },
  { plato: "Filet Mignon 21oz", categoria: "Cortes", disponible: true },
  { plato: "Filet Mignon 14oz", categoria: "Cortes", disponible: true },
  { plato: "Filet Mignon con jamón, queso y huevo 14oz", categoria: "Cortes", disponible: true },
  { plato: "T-Bone CAB 28oz", categoria: "Cortes", disponible: true },
  { plato: "Tomahawk CAB 48oz", categoria: "Cortes", disponible: true },
  { plato: "Cowboy Bone-In Rib Eye 28oz", categoria: "Cortes", disponible: true },
  { plato: "Flap Steak 21oz", categoria: "Cortes", disponible: true },
  { plato: "Flap Steak 14oz", categoria: "Cortes", disponible: true },
  { plato: "Brochette de lomo", categoria: "Cortes", disponible: true },
  { plato: "Wagyu corte especial", categoria: "Cortes", disponible: true },
  { plato: "Dry Aged especial", categoria: "Cortes", disponible: true },
  // Entradas
  { plato: "Chorizo", categoria: "Entradas", disponible: true },
  { plato: "Morcilla", categoria: "Entradas", disponible: true },
  { plato: "Mollejas a la parrilla", categoria: "Entradas", disponible: true },
  { plato: "Provoleta argentina", categoria: "Entradas", disponible: true },
  { plato: "Provoleta especial", categoria: "Entradas", disponible: true },
  { plato: "Gambas pil-pil", categoria: "Entradas", disponible: true },
  { plato: "Gambas a la parrilla", categoria: "Entradas", disponible: true },
  { plato: "Empanadas de choclo", categoria: "Entradas", disponible: true },
  { plato: "Empanadas de carne", categoria: "Entradas", disponible: true },
  { plato: "Empanadas veggie", categoria: "Entradas", disponible: true },
  { plato: "Burrata sobre tartar de tomate y palta", categoria: "Entradas", disponible: true },
  // Pastas
  { plato: "Ravioles de hongos y trufa", categoria: "Pastas", disponible: true },
  { plato: "Ravioles de ricota y espinaca", categoria: "Pastas", disponible: true },
  { plato: "Ñoquis soufflé Triplo Burro", categoria: "Pastas", disponible: true },
  { plato: "Ñoquis soufflé tres quesos", categoria: "Pastas", disponible: true },
  { plato: "Penne Rigate con pesto cremoso", categoria: "Pastas", disponible: true },
  { plato: "Spaghetti con salsa de mariscos", categoria: "Pastas", disponible: true },
  // Ensaladas
  { plato: "César de pollo con panceta", categoria: "Ensaladas", disponible: true },
  { plato: "Rúcula y parmesano", categoria: "Ensaladas", disponible: true },
  { plato: "Palta, palmito y tomate", categoria: "Ensaladas", disponible: true },
  { plato: "Peras y queso de cabra", categoria: "Ensaladas", disponible: true },
  { plato: "Tataki de atún", categoria: "Ensaladas", disponible: true },
  { plato: "Mixta", categoria: "Ensaladas", disponible: true },
  // Guarniciones
  { plato: "Brócoli al vapor", categoria: "Guarniciones", disponible: true },
  { plato: "Macarrones con queso", categoria: "Guarniciones", disponible: true },
  { plato: "Papas fritas", categoria: "Guarniciones", disponible: true },
  { plato: "Papas fritas con cebolla caramelizada", categoria: "Guarniciones", disponible: true },
  { plato: "Papas fritas con huevo revuelto", categoria: "Guarniciones", disponible: true },
  { plato: "Papas fritas con queso azul", categoria: "Guarniciones", disponible: true },
  { plato: "Puré de calabaza", categoria: "Guarniciones", disponible: true },
  { plato: "Puré de papas", categoria: "Guarniciones", disponible: true },
  { plato: "Puré mixto", categoria: "Guarniciones", disponible: true },
  { plato: "Verduras a la parrilla", categoria: "Guarniciones", disponible: true },
  // Postres
  { plato: "Flan casero especial", categoria: "Postres", disponible: true },
  { plato: "Crepas de dulce de leche", categoria: "Postres", disponible: true },
  { plato: "Torta de galletitas y dulce de leche", categoria: "Postres", disponible: true },
  { plato: "Crème brûlée", categoria: "Postres", disponible: true },
  { plato: "Port Salut con membrillo y batata", categoria: "Postres", disponible: true },
  { plato: "Cheesecake de dulce de leche", categoria: "Postres", disponible: true },
  { plato: "Volcán de chocolate con helado", categoria: "Postres", disponible: true },
  { plato: "Degustación de postres", categoria: "Postres", disponible: true },
  { plato: "Degustación de helados", categoria: "Postres", disponible: true },
  // Pescados
  { plato: "Salmón a la parrilla", categoria: "Pescados", disponible: true },
  { plato: "Atún a la parrilla con verduras", categoria: "Pescados", disponible: true },
  { plato: "Pescado del día", categoria: "Pescados", disponible: true },
  { plato: "Pulpo a la parrilla", categoria: "Pescados", disponible: true },
  // Pollo y milanesas
  { plato: "Pechuga con queso ahumado", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Pechuga con manteca de hierbas", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Pollo a la parrilla", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Brochette de pollo", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Milanesa de Outside Skirt", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Milanesa napolitana de Outside Skirt", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Milanesa napolitana de New York Strip", categoria: "Pollo y milanesas", disponible: true },
  { plato: "Milanesa napolitana de pollo", categoria: "Pollo y milanesas", disponible: true },
];

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // Insertar todos los platos
    const { error } = await supabase.from("menu_disponibilidad").insert(PLATOS);
    if (error) throw error;
    return res.status(200).json({ ok: true, inserted: PLATOS.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
