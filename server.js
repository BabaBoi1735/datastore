import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const playerSchema = new mongoose.Schema({
  userId: Number,
  username: String,
  data: Object,
  timestamp: { type: Date, default: Date.now }
});

const PlayerData = mongoose.models.PlayerData || mongoose.model("PlayerData", playerSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, username, data } = req.body;

  if (!userId || !username || !data) {
    return res.status(400).json({ error: "Ontbrekende velden" });
  }

  try {
    await PlayerData.create({ userId, username, data });
    return res.status(200).json({ status: "success" });
  } catch (err) {
    console.error("Opslagfout:", err);
    return res.status(500).json({ error: "Serverfout" });
  }
}
