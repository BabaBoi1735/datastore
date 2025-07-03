const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
.then(() => console.log("✅ Verbonden met MongoDB"))
.catch(err => {
	console.error("❌ MongoDB fout:", err);
	process.exit(1);
});

const playerSchema = new mongoose.Schema({
	userId: Number,
	username: String,
	data: Object,
	timestamp: { type: Date, default: Date.now }
});

const PlayerData = mongoose.model("PlayerData", playerSchema);

app.post("/api/savedata", async (req, res) => {
	const { userId, username, data } = req.body;

	if (!userId || !username || !data) {
		return res.status(400).json({ error: "Ontbrekende velden" });
	}

	try {
		await PlayerData.create({ userId, username, data });
		res.json({ status: "success" });
	} catch (err) {
		console.error("Opslagfout:", err);
		res.status(500).json({ error: "Serverfout" });
	}
});

app.listen(process.env.PORT, () => {
	console.log(`🚀 Server draait op poort ${process.env.PORT}`);
});
