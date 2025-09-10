import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ⚠️ Leemos el token desde .env
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

// Crear preferencia
app.post("/create_preference", async (req, res) => {
  try {
    const { items, external_reference, description } = req.body;

    const result = await mercadopago.preferences.create({
      items: items.map(p => ({
        title: p.title,
        quantity: p.quantity,
        currency_id: "UYU",
        unit_price: p.unit_price
      })),
      external_reference,
      description,
      back_urls: {
        success: "https://tu-dominio.netlify.app/pago-exitoso",
        failure: "https://tu-dominio.netlify.app/pago-fallido",
        pending: "https://tu-dominio.netlify.app/pago-pendiente"
      },
      auto_return: "approved"
    });

    res.json({ init_point: result.body.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: "Error al crear preferencia" });
  }
});

// Levantar servidor (Render asigna el puerto con process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});
