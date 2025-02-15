const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
app.post('/api/students', async (req, res) => {
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
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 }); // Sort A-Z by name
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// PUT route to update student data
app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to retrieve all students of a particular class
app.get('/api/class/:className', async (req, res) => {
  const { className } = req.params;
  try {
    const students = await Student.find({ class: className });
    res.send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});







/*const express = require('express');
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
*/
