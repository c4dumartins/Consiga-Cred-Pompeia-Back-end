const express = require("express");
const cors = require("cors");
const feedbackRoutes = require("./src/routes/feedbacks"); // aponta para sua pasta feedbacks

const app = express();
app.use(cors());
app.use(express.json());

app.use("/feedbacks", feedbackRoutes);

app.listen(3001, () => console.log("API rodando na porta 3001"));
