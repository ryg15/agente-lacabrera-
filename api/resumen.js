const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const [{ data: leads }, { data: reservas }, { data: reviews }, { data: conversaciones }] =
      await Promise.all([
        supabase.from("leads").select("*").gte("created_at", hoy.toISOString()),
        supabase.from("reservas").select("*").gte("created_at", hoy.toISOString()),
        supabase.from("reviews").select("*").gte("created_at", hoy.toISOString()),
        supabase.from("conversaciones").select("*").gte("created_at", hoy.toISOString()),
      ]);

    const promedioEstrellas = reviews?.length
      ? (reviews.reduce((acc, r) => acc + (r.estrellas || 0), 0) / reviews.length).toFixed(1)
      : "—";

    const fecha = new Date().toLocaleDateString("es-AR", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    const htmlEmail = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Georgia, serif; background:#0A0806; color:#F2E8D9; padding:40px; max-width:600px; margin:auto;">
  <div style="border-top:3px solid #C8953A; padding-top:24px; margin-bottom:32px;">
    <h1 style="font-size:28px; color:#C8953A; margin:0;">La Cabrera Miami</h1>
    <p style="color:#6B6560; margin:4px 0 0;">Informe de cierre · ${fecha}</p>
  </div>

  <div style="display:grid; gap:16px; margin-bottom:32px;">
    <div style="background:#1E1A16; border-left:3px solid #C8953A; padding:20px; border-radius:6px;">
      <p style="color:#6B6560; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 8px;">Conversaciones totales</p>
      <p style="font-size:36px; margin:0; color:#F2E8D9;">${conversaciones?.length || 0}</p>
    </div>
    <div style="background:#1E1A16; border-left:3px solid #40916C; padding:20px; border-radius:6px;">
      <p style="color:#6B6560; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 8px;">Leads capturados</p>
      <p style="font-size:36px; margin:0; color:#F2E8D9;">${leads?.length || 0}</p>
    </div>
    <div style="background:#1E1A16; border-left:3px solid #C0392B; padding:20px; border-radius:6px;">
      <p style="color:#6B6560; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 8px;">Reservas generadas</p>
      <p style="font-size:36px; margin:0; color:#F2E8D9;">${reservas?.length || 0}</p>
    </div>
    <div style="background:#1E1A16; border-left:3px solid #3B82F6; padding:20px; border-radius:6px;">
      <p style="color:#6B6560; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 8px;">Reviews recibidos · Promedio</p>
      <p style="font-size:36px; margin:0; color:#F2E8D9;">${reviews?.length || 0} <span style="font-size:18px; color:#C8953A;">★ ${promedioEstrellas}</span></p>
    </div>
  </div>

  ${reservas?.length ? `
  <div style="margin-bottom:32px;">
    <h2 style="color:#C8953A; font-size:14px; text-transform:uppercase; letter-spacing:0.1em; border-bottom:1px solid #2A2420; padding-bottom:8px;">Reservas del día</h2>
    ${reservas.map(r => `
    <div style="padding:12px 0; border-bottom:1px solid #1E1A16;">
      <strong style="color:#F2E8D9;">${r.nombre}</strong> — ${r.fecha} ${r.hora} · ${r.personas} personas
      ${r.ocasion ? `<br><span style="color:#6B6560; font-size:12px;">${r.ocasion}</span>` : ""}
      ${r.notas ? `<br><span style="color:#6B6560; font-size:12px;">${r.notas}</span>` : ""}
    </div>`).join("")}
  </div>` : ""}

  ${leads?.length ? `
  <div style="margin-bottom:32px;">
    <h2 style="color:#C8953A; font-size:14px; text-transform:uppercase; letter-spacing:0.1em; border-bottom:1px solid #2A2420; padding-bottom:8px;">Leads del día</h2>
    ${leads.map(l => `
    <div style="padding:12px 0; border-bottom:1px solid #1E1A16;">
      <strong style="color:#F2E8D9;">${l.nombre}</strong>
      ${l.telefono ? `· ${l.telefono}` : ""}
      ${l.email ? `· ${l.email}` : ""}
      <br><span style="color:#6B6560; font-size:12px;">${l.tipo || ""} ${l.mensaje ? "— " + l.mensaje : ""}</span>
    </div>`).join("")}
  </div>` : ""}

  ${reviews?.length ? `
  <div style="margin-bottom:32px;">
    <h2 style="color:#C8953A; font-size:14px; text-transform:uppercase; letter-spacing:0.1em; border-bottom:1px solid #2A2420; padding-bottom:8px;">Reviews del día</h2>
    ${reviews.map(r => `
    <div style="padding:12px 0; border-bottom:1px solid #1E1A16;">
      <span style="color:#C8953A;">${"★".repeat(r.estrellas || 5)}</span>
      <br><em style="color:#F2E8D9;">"${r.comentario}"</em>
      <br><span style="color:#6B6560; font-size:12px;">— ${r.nombre}</span>
    </div>`).join("")}
  </div>` : ""}

  <div style="margin-top:40px; padding-top:16px; border-top:1px solid #2A2420; color:#6B6560; font-size:11px;">
    Informe generado automáticamente por el asistente Facu · La Cabrera Miami
  </div>
</body>
</html>`;

    // Enviar email via Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Facu · La Cabrera <facu@roxanabrandstudios.com>",
        to: [process.env.ADMIN_EMAIL],
        subject: `📊 Informe de cierre · La Cabrera Miami · ${fecha}`,
        html: htmlEmail,
      }),
    });

    if (!resendResponse.ok) {
      const err = await resendResponse.text();
      throw new Error(`Resend error: ${err}`);
    }

    return res.status(200).json({ ok: true, mensaje: "Informe enviado correctamente" });

  } catch (error) {
    console.error("Error en resumen:", error);
    return res.status(500).json({ error: error.message });
  }
};
