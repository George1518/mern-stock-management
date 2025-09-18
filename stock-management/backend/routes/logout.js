const express = require("express");
const router = express.Router();

// Logout route
router.post("/", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
          success: false,
          message: "Could not log out, please try again"
        });
      }
      res.clearCookie("connect.sid"); // clears cookie in browser
      return res.json({
        success: true,
        message: "Logged out successfully"
      });
    });
  } else {
    res.json({
      success: true,
      message: "No active session"
    });
  }
});

module.exports = router;
