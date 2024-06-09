import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  level: { type: String, required: true, enum: ['easy', 'medium', 'hard'] },
  subject: { type: String, required: true }
});

const Question = mongoose.model('Question', questionSchema);

export default Question;