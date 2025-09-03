const express = require("express");
const router = express.Router();
const db = require("../db");

// GET todos os feedbacks
router.get("/", (req, res) => {
  db.query("SELECT * FROM feedback ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST novo feedback
router.post("/", (req, res) => {
  const { name, email, message, user_id } = req.body;
  if (!name || !email || !message || !user_id) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  db.query(
    "INSERT INTO feedback (name, email, message, user_id) VALUES (?, ?, ?, ?)",
    [name, email, message, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
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
});

// DELETE feedback apenas pelo dono
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (!user_id) return res.status(400).json({ error: "user_id é obrigatório" });

  db.query(
    "DELETE FROM feedback WHERE id = ? AND user_id = ?",
    [id, user_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.affectedRows === 0) return res.status(403).json({ error: "Não autorizado" });
      res.json({ message: "Feedback deletado com sucesso" });
    }
  );
});

module.exports = router;
