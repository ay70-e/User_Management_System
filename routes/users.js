const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

//---------------------------------------------------------------------------------

router.get("/", authMiddleware(["admin"]), async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  res.json(users);
});


//---------------------------------------------------------------------------------

router.get("/:id", authMiddleware(), async (req, res) => {
  const user = await User.findByPk(req.params.id, { attributes: { exclude: ["password"] } });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (req.user.role !== "admin" && req.user.id != req.params.id)
    return res.status(403).json({ message: "403 Forbidden" });

  res.json(user);
});


//---------------------------------------------------------------------------------


router.put("/:id", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role !== "admin" && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

  
//---------------------------------------------------------------------------------

    const { name, email, password } = req.body;

    await user.update({ name, email, password });

    const { password: pwd, ...userData } = user.toJSON();
    res.json({ message: "User updated successfully", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//---------------------------------------------------------------------------------

router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
