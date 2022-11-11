import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: false
  },
  editedAt: {
    type: Date,
    required: false
  },
  editedBy: {
    type: String,
    required: false
  }
});

export default mongoose.model("messages", PostSchema);
