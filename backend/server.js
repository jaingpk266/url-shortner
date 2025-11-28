import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import linkRoutes from "./routes/links.js";
import Link from "./models/Link.js";

dotenv.config();
connectDB();

const app = express();

// CORS
app.use(cors({
  origin: "*",
}));

app.use(express.json());

// Health check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/links", linkRoutes);

// Redirect short URL
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Update click count
    link.clicks += 1;
    await link.save();

    // Redirect to target URL
    return res.redirect(link.targetUrl);

  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
