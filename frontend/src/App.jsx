import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "https://mern-student-management-zig7.onrender.com";

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Get all students
  const getStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Add / Update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !course.trim()) {
      alert("Please enter both student name and course.");
      return;
    }

    try {
      if (editingId) {
        await fetch(`${API_URL}/students/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            course
          })
        });
      } else {
        await fetch(`${API_URL}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            course
          })
        });
      }

      setName("");
      setCourse("");
      setEditingId(null);

      getStudents();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Start editing
  const editStudent = (student) => {
    setName(student.name);
    setCourse(student.course);
    setEditingId(student._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Delete student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      getStudents();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Unable to delete student.");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setName("");
    setCourse("");
    setEditingId(null);
  };

  // Search
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
          Student<span>Hub</span>
        </div>

        <div className="nav-text">
          Student Management System
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <p className="tag">MERN STACK APPLICATION</p>

          <h1>
            Manage Students
            <br />
            <span>Simply & Efficiently.</span>
          </h1>

          <p className="hero-description">
            A simple student management system built using
            React, Node.js, Express.js and MongoDB.
          </p>
        </div>

        <div className="student-count">
          <span>{students.length}</span>
          <p>Total Students</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container">

        {/* Form */}
        <section className="card form-card">
          <div className="section-heading">
            <div>
              <p className="small-title">
                {editingId ? "UPDATE STUDENT" : "ADD STUDENT"}
              </p>

              <h2>
                {editingId
                  ? "Edit Student Details"
                  : "Add a New Student"}
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="student-form">

            <div className="input-group">
              <label>Student Name</label>

              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Course</label>

              <input
                type="text"
                placeholder="Enter course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              />
            </div>

            <div className="button-group">

              <button type="submit" className="primary-button">
                {editingId ? "Update Student" : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </section>

        {/* Student List */}
        <section className="students-section">

          <div className="list-header">

            <div>
              <p className="small-title">STUDENT DIRECTORY</p>

              <h2>Registered Students</h2>
            </div>

            <input
              className="search-box"
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {filteredStudents.length === 0 ? (
            <div className="empty-state">
              <h3>No students found</h3>
              <p>
                Add a student or try a different search.
              </p>
            </div>
          ) : (
            <div className="student-grid">

              {filteredStudents.map((student, index) => (

                <div className="student-card" key={student._id}>

                  <div className="student-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="student-info">

                    <h3>{student.name}</h3>

                    <p>{student.course}</p>

                  </div>

                  <div className="actions">

                    <button
                      className="edit-button"
                      onClick={() => editStudent(student)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteStudent(student._id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>

      </main>

      <footer>
        StudentHub • MERN Stack Student Management System
      </footer>

    </div>
  );
}

export default App;