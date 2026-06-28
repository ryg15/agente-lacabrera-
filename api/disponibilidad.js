const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — traer todos los platos
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("menu_disponibilidad")
      .select("*")
      .order("categoria")
      .order("plato");

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // POST — actualizar disponibilidad
  if (req.method === "POST") {
    const { id, disponible } = req.body;
    const { error } = await supabase
      .from("menu_disponibilidad")
      .update({ disponible })
      .eq("id", id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }
};
