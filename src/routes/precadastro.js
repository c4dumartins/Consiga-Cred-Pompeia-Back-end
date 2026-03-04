const express = require("express");
const precadastroController = require("../controllers/precadastroController");

const router = express.Router();

router.post("/", precadastroController.enviarPreCadastro);

module.exports = router;