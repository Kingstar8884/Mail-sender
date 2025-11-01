require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json()); // Parse JSON body

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) console.error("❌ Transporter error:", error);
  else console.log("✅ Ready to send emails!");
});

app.post("/send-mail", async (req, res) => {
  const { to, subject, text, html } = req.body;
  
  if (!to){
    return res.status(500).json({ status: "error", error: "{to} is required!" });
  };
  
  if (!subject){
    return res.status(500).json({ status: "error", error: "{subject} is required!" });
  };
  
  if (!text || !html){
    return res.status(500).json({ status: "error", error: "{html} / {text} is required!" });
  };
  
  if (text && html){
    return res.status(500).json({ status: "error", error: "{html} && {text} - only one is required!" });
  };
  

  const mailOptions = {
    from: `Dappsics APP <${process.env.SMTP_USER}>`,
    to,
    subject,
  };
  
  if (html) mailOptions.html = html;
  if (text) mailOptions.text = text;

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    res.status(200).json({ status: "success", data: info });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
