import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

export default QuizResult