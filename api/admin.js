const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [
      { data: leads },
      { data: reservas },
      { data: reviews },
      { data: conversaciones },
      { data: leadsTotal },
      { data: reservasTotal },
    ] = await Promise.all([
      supabase.from("leads").select("*").gte("created_at", hoy.toISOString()).order("created_at", { ascending: false }),
      supabase.from("reservas").select("*").gte("created_at", hoy.toISOString()).order("created_at", { ascending: false }),
      supabase.from("reviews").select("*").gte("created_at", hoy.toISOString()).order("created_at", { ascending: false }),
      supabase.from("conversaciones").select("*").gte("created_at", hoy.toISOString()),
      supabase.from("leads").select("*"),
      supabase.from("reservas").select("*"),
    ]);

    const promedioEstrellas = reviews?.length
      ? (reviews.reduce((acc, r) => acc + (r.estrellas || 0), 0) / reviews.length).toFixed(1)
      : null;

    return res.status(200).json({
      hoy: {
        conversaciones: conversaciones?.length || 0,
        leads: leads?.length || 0,
        reservas: reservas?.length || 0,
        reviews: reviews?.length || 0,
        promedioEstrellas,
      },
      total: {
        leads: leadsTotal?.length || 0,
        reservas: reservasTotal?.length || 0,
      },
      datos: {
        leads: leads || [],
        reservas: reservas || [],
        reviews: reviews || [],
      },
    });

  } catch (error) {
    console.error("Error en admin:", error);
    return res.status(500).json({ error: error.message });
  }
};
