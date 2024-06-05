import mongoose from "mongoose";

// Define a schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  department: { type: String, required: [true, "Department is required"] },
});

export default mongoose.model('User', userSchema);
