import mongoose from "mongoose";

const LinkSchema = new mongoose.Schema({
    code: {
    type: String,
    required: true,
    unique: true
  },
  targetUrl: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Link = mongoose.model('Link', LinkSchema);

export default Link