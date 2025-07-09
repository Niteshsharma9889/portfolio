const express = require("express");
const path = require("path");
const app = express();
const PORT = 5000;
require("dotenv").config(); // Load env vars from .env

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// EmailJS configuration endpoint — SAFE (no fallback defaults!)
app.get("/api/emailjs-config", (req, res) => {
  const { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } =
    process.env;

  if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    return res
      .status(500)
      .json({ success: false, message: "EmailJS config missing" });
  }

  res.json({
    publicKey: EMAILJS_PUBLIC_KEY,
    serviceId: EMAILJS_SERVICE_ID,
    templateId: EMAILJS_TEMPLATE_ID,
  });
});

// Contact form endpoint
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter a valid email address" });
  }

  console.log("Contact form submission:", {
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString(),
  });

  res.json({
    success: true,
    message: `Thank you ${name}! Your message has been received.`,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
});
