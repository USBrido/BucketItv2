const express = require('express');
const router  = express.Router();
const bcrypt = require(bcrypt);

module.exports = (db) => {
  router.get("/register", (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !password || !name) {
      return res.status(500).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.query(`
    INSERT INTO users(name, email, password)
    VALUES($1, $2, $3)
    RETURNING *;`,
    [name, email, hash])
      .then(data => {
        const newUser = data.rows[0];
        req.session.userId = newUser.id;
        res.redirect('/');
      });
  });
  return router;
};
