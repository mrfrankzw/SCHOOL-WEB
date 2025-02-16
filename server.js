const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = 'mongodb+srv://darexmucheri:cMd7EoTwGglJGXwR@cluster0.uwf6z.mongodb.net/schoolDB?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB: ', err));

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
  subjects: [{
    name: String,
    mark: Number,
    grade: String
  }]
});

// Model for student data
const Student = mongoose.model('Student', studentSchema);

// Grade calculation function
function getGrade(mark) {
  if (mark >= 90) return 'A';
  if (mark >= 80) return 'B';
  if (mark >= 70) return 'C';
  if (mark >= 60) return 'D';
  if (mark >= 50) return 'E';
  return 'U';
}

// Routes
// POST route to save student data
app.post('/students', async (req, res) => {
  try {
    const { name, surname, year, class: studentClass, term, subjects } = req.body;
    const gradedSubjects = subjects.map(subject => ({
      name: subject.name,
      mark: subject.mark,
      grade: getGrade(subject.mark)
    }));

    const student = new Student({
      name,
      surname,
      year,
      class: studentClass,
      term,
      subjects: gradedSubjects
    });

    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to retrieve all students
app.get('/studentss', async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }); // Sort A-Z by name
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT route to update student data
app.put('/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to retrieve all students of a particular class
app.get('/class/:className', async (req, res) => {
  const { className } = req.params;
  try {
    const students = await Student.find({ class: className });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Serve 'newstudent.html' on the root path ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'newstudent.html'));  // Serve from the root directory
});

// Serve 'reportcard.html' on a specific route ("/reportcard")
app.get('/reportcard', (req, res) => {
  res.sendFile(path.join(__dirname, 'reportcard.html'));  // Serve from the root directory
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
