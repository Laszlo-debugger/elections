const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// POST endpoint to upload election form
app.post("/upload", upload.single("form"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
    res.json({ extractedText: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing image" });
  }
});

app.get("/", (req, res) => {
  res.send("Election OCR API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
