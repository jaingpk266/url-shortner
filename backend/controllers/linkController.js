import { nanoid } from "nanoid";
import Link from "../models/Link.js";

// create a short link
export const createLink = async (req, res) => {
  try {
    const { targetUrl, customCode } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ message: "targetUrl is required" });
    }

    // normalize URL (ensure it starts with http)
    const normalized = targetUrl.startsWith("http")
      ? targetUrl
      : `https://${targetUrl}`;

    // choose code
    const code = customCode ? customCode.trim() : nanoid(7);

    // check custom code conflict
    if (customCode) {
      const existing = await Link.findOne({ code });
      if (existing) {
        return res.status(409).json({ message: "Custom code already in use" });
      }
    }

    const newLink = new Link({ code, targetUrl: normalized });
    await newLink.save();

    return res.status(201).json({
      code,
      shortUrl: `${process.env.BASE_URL}/${code}`,
      targetUrl: normalized,
      clicks: 0,
      createdAt: newLink.createdAt
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// list all links
export const listLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 }).lean();
    return res.json(links);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// get one link by code
export const getLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOne({ code }).lean();
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    return res.json(link);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// delete link
export const deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const deleted = await Link.findOneAndDelete({ code });

    if (!deleted) {
      return res.status(404).json({ message: "Link not found" });
    }

    return res.json({ message: "Deleted successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
