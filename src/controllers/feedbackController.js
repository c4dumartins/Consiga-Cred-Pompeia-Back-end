const db = require("../../db");

exports.getAllFeedback = async (req, res) => {
  try {
    db.query("SELECT * FROM feedback ORDER BY created_at DESC", (err, results) => {
      if (err) {
        console.error("Erro ao buscar feedbacks:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (err) {
    console.error("Erro no getAllFeedback:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createFeedback = async (req, res) => {
  const { name, email, message, user_id } = req.body;
  
  if (!name || !email || !message || !user_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  try {
    db.query(
      "INSERT INTO feedback (name, email, message, user_id) VALUES (?, ?, ?, ?)",
      [name, email, message, user_id],
      (err, results) => {
        if (err) {
          console.error("Erro ao criar feedback:", err);
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: results.insertId,
          name,
          email,
          message,
          user_id,
          created_at: new Date()
        });
      }
    );
  } catch (err) {
    console.error("Erro no createFeedback:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id é obrigatório" });
  }

  try {
    // Verifica se é admin
    db.query(
      "SELECT 1 FROM admins WHERE user_id = ?",
      [user_id],
      (err, adminResults) => {
        if (err) {
          console.error("Erro ao verificar admin:", err);
          return res.status(500).json({ error: err.message });
        }

        const isAdmin = adminResults.length > 0;

        // Se for admin, deleta qualquer feedback
        // Se não for, só deleta o próprio
        const query = isAdmin
          ? "DELETE FROM feedback WHERE id = ?"
          : "DELETE FROM feedback WHERE id = ? AND user_id = ?";

        const params = isAdmin ? [id] : [id, user_id];

        db.query(query, params, (err, results) => {
          if (err) {
            console.error("Erro ao deletar feedback:", err);
            return res.status(500).json({ error: err.message });
          }
          if (results.affectedRows === 0) {
            return res.status(403).json({
              error: "Feedback não encontrado ou sem permissão",
            });
          }
          res.status(204).send();
        });
      }
    );
  } catch (err) {
    console.error("Erro no deleteFeedback:", err);
    res.status(500).json({ error: err.message });
  }
};