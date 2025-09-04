exports.getAllFeedback = async (req, res) => {
    try {
      const results = await db.query("SELECT * FROM feedback ORDER BY created_at DESC");
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

exports.createFeedback = async (req, res) => {
    const { name, email, message, user_id } = req.body;
    if (!name || !email || !message || !user_id) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    try {
      const results = await db.query(
        "INSERT INTO feedback (name, email, message, user_id) VALUES (?, ?, ?, ?)",
        [name, email, message, user_id]
      );
      res.status(201).json({
        id: results.insertId,
        name,
        email,
        message,
        user_id,
        created_at: new Date()
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  exports.deleteFeedback = async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    if (!user_id) return res.status(400).json({ error: "user_id é obrigatório" });

    try {
      const results = await db.query(
        "DELETE FROM feedback WHERE id = ? AND user_id = ?",
        [id, user_id]
      );
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Feedback não encontrado ou não autorizado" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
