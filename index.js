import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from "mongoose";
import User from './models/userModel.js';
import Question from './models/questionModel.js';
import QuizResult from './models/quizResult.js';

// server.js
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quiz-app').then(() => {
  console.log('Connected to MongoDB');
});


// Define a route for creating a new user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error });
  }
});

// Define a route for fetching all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error });
  }
});

// add a register route
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Failed to register user', error });
  }
});


// add a login route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to login', error });
  }
});

// add question route
app.post('/questions', async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json({ message: 'Question added successfully', question });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add question', error });
  }
});

// get questions route
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ message: 'Questions fetched successfully', questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error });
  }
});

// generate questions
app.get("/generate-question", async (req, res) => {
  const { topic, level } = req.query;

  if (!topic || !level) {
    return res.status(400).json({ error: "Topic and level are required" });
  }

  const filteredQuestions = await Question.find({ subject: topic, level });

  // Randomly select 5 questions
  const randomQuestions = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

  res.json(randomQuestions);
});


// save quiz result
app.post("/save-score", async (req, res) => {
  const { user, level, score, topic } = req.body;

  try {
    const quizResult = new QuizResult({ user, level, subject: topic, score });
    await quizResult.save();
    res.status(201).json({ message: "Quiz result saved successfully" });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// get user scores
app.get("/get-score", async (req, res) => {
  try {
    const userScores = await QuizResult.find({ user: req.query.user })
      .populate("user") // Assuming you have a 'User' model and want to populate the username
      .select("-__v") // Exclude '__v' field from the result
      .sort({ date: -1 }); // Sort by date in descending order

    res.json(userScores);

  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
