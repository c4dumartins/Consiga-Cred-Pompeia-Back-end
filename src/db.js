const mysql2 = require("mysql2"); // Use mysql2 que é mais estável

const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // Verifique se sua senha é realmente 'root' ou vazia ''
  database: "feedbacks_db",
  port: 3306 // SE NÃO FUNCIONAR, MUDE PARA 3306
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

module.exports = db;