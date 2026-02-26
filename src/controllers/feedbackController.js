// Ajustado para buscar o db.js dentro da mesma pasta src
const db = require("../db");

// GET - Listar todos os feedbacks
exports.getAllFeedback = (req, res) => {
  const query = "SELECT * FROM feedback ORDER BY created_at DESC";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar feedbacks:", err);
      return res.status(500).json({ error: "Erro interno no servidor ao buscar dados." });
    }
    res.status(200).json(results);
  });
};

// POST - Criar um novo feedback
exports.createFeedback = (req, res) => {
  const { name, email, message, user_id } = req.body;

  // Validação básica de campos
  if (!name || !email || !message || !user_id) {
    return res.status(400).json({ error: "Todos os campos (name, email, message, user_id) são obrigatórios" });
  }

  const query = "INSERT INTO feedback (name, email, message, user_id) VALUES (?, ?, ?, ?)";
  const values = [name, email, message, user_id];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Erro ao inserir feedback no banco:", err);
      return res.status(500).json({ error: "Erro ao salvar o feedback." });
    }

    res.status(201).json({
      id: results.insertId,
      name,
      email,
      message,
      user_id,
      created_at: new Date()
    });
  });
};

// DELETE - Remover um feedback (apenas se o user_id bater)
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id é obrigatório para deletar" });
  }

  const query = "DELETE FROM feedback WHERE id = ? AND user_id = ?";

  db.query(query, [id, user_id], (err, results) => {
    if (err) {
      console.error("Erro ao deletar feedback:", err);
      return res.status(500).json({ error: "Erro ao processar a exclusão." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ 
        error: "Feedback não encontrado ou você não tem permissão para excluí-lo." 
      });
    }

    res.status(204).send(); // Sucesso sem conteúdo
  });
};