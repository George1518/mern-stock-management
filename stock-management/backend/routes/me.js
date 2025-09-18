// routes/me.js
const express = require("express");
const router = express.Router();
const User = require("../model/user");

router.get("/", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const user = await User.findById(req.session.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error in /me:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
