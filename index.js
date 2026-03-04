require("dotenv").config();

const express = require("express");
const cors = require("cors");

const feedbackRoutes    = require("./src/routes/feedbacks");
const precadastroRoutes = require("./src/routes/precadastro"); // ← NOVO

const app = express();

app.use(cors());
app.use(express.json());

app.use("/feedbacks",   feedbackRoutes);
app.use("/precadastro", precadastroRoutes); // ← NOVO

app.get("/", (req, res) => {
  res.json({ status: "online", service: "ConsigaCred API" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 API rodando na porta ${PORT}`);
  console.log(`   GET  http://localhost:${PORT}/feedbacks`);
  console.log(`   POST http://localhost:${PORT}/precadastro\n`);
});