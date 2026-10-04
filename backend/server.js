const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  course: {
    type: String,
    required: true
  }
});

const Student = mongoose.model("Student", studentSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("MERN Student Management System Running");
});

// GET - All Students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error fetching students"
    });
  }
});

// POST - Add Student
app.post("/students", async (req, res) => {
  try {
    const { name, course } = req.body;

    const student = new Student({
      name,
      course
    });

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error adding student"
    });
  }
});

// PUT - Update Student
app.put("/students/:id", async (req, res) => {
  try {
    const { name, course } = req.body;

    const updatedStudent =
      await Student.findByIdAndUpdate(
        req.params.id,
        {
          name,
          course
        },
        {
          new: true
        }
      );

    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error updating student"
    });
  }
});

// DELETE - Delete Student
app.delete("/students/:id", async (req, res) => {
  try {
    const deletedStudent =
      await Student.findByIdAndDelete(
        req.params.id
      );

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    res.json({
      message: "Student deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting student"
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});