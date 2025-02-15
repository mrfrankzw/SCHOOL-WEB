const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/schoolDB?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Student Schema
const studentSchema = new mongoose.Schema({
  profilePhoto: String,
  name: String,
  surname: String,
  dob: Date,
  gender: String,
  parentName: String,
  parentPhone: String,
  address: String,
  year: Number,
  class: String,
  term: String,
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.post('/api/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }); // Sort A-Z
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
