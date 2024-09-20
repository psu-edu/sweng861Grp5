import React, { useState } from 'react';
import './Semester Registration.css'; // Import the corresponding CSS

const SemesterRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    studentID: '',
    email: '',
    phone: '',
    semester: '',
    courses: [],
    studyMode: '',
    comments: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'courses') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      if (selectedOptions.length <= 3) {
        setFormData({
          ...formData,
          courses: selectedOptions
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    alert('Registration successful!');
  };

  return (
    <div className="registration-container">
      <div className="registration-box">
        <h2>Semester Class Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            {/* Column 1 */}
            <div className="column">
              <div className="input-field">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label>Student ID:</label>
                <input
                  type="text"
                  name="studentID"
                  value={formData.studentID}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-field">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="column">
              <div className="input-field">
                <label>Semester:</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Semester</option>
                  <option value="Fall 2024">Fall 2024</option>
                  <option value="Spring 2025">Spring 2025</option>
                  <option value="Summer 2025">Summer 2025</option>
                </select>
              </div>

              <div className="input-field">
                <label>Courses (Select up to 3):</label>
                <select
                  name="courses"
                  value={formData.courses}
                  onChange={handleChange}
                  multiple
                  required
                >
                  <option disabled>Year 1, Semester 1</option>
                  <option value="SWENG 861Software Construction">SWENG 861 - Software Construction</option>
                  <option value="SWENG 586Requirements Engineering">SWENG 586 - Requirements Engineering</option>

                  <option disabled>Year 1, Semester 2</option>
                  <option value="SWENG 887Software Systems Architecture">SWENG 887 - Software Systems Architecture</option>
                  <option value="SWENG 837Software System Design">SWENG 837 - Software System Design</option>

                  <option disabled>Year 1, Semester 3</option>
                  <option value="SWENG 805Software Project Management">SWENG 805 - Software Project Management</option>
                  <option value="SWENG 581Software Testing">SWENG 581 - Software Testing</option>

                  <option disabled>Year 2, Semesters 4 & 5</option>
                  <option value="A-I 570Deep Learning">A-I 570 - Deep Learning</option>
                  <option value="A-I 572Reinforcement Learning">A-I 572 - Reinforcement Learning</option>
                  <option value="A-I 574Natural Language Processing">A-I 574 - Natural Language Processing</option>
                  <option value="A-I 801Foundations of Artificial Intelligence">A-I 801 - Foundations of Artificial Intelligence</option>
                  <option value="A-I 879Machine Vision">A-I 879 - Machine Vision</option>
                  <option value="DAAN 545Data Mining">DAAN 545 - Data Mining</option>
                  <option value="DAAN 825Large-Scale Database and Warehouse">DAAN 825 - Large-Scale Database and Warehouse</option>
                  <option value="DAAN 862Analytics Programming in Python">DAAN 862 - Analytics Programming in Python</option>
                  <option value="DAAN 871Data Visualization">DAAN 871 - Data Visualization</option>
                  <option value="IE 575Foundations of Predictive Analytics">IE 575 - Foundations of Predictive Analytics</option>
                  <option value="INSC 521Database Design Concepts">INSC 521 - Database Design Concepts</option>
                  <option value="INSC 561Web Security and Privacy">INSC 561 - Web Security and Privacy</option>
                  <option value="STAT 500Applied Statistics">STAT 500 - Applied Statistics</option>
                  <option value="SWENG 888Mobile Computing and Applications">SWENG 888 - Mobile Computing and Applications</option>

                  <option disabled>Year 2, Semester 6</option>
                  <option value="SWENG 894Software Engineering Studio">SWENG 894 - Software Engineering Studio</option>
                </select>
              </div>

              <div className="input-field">
                <label>Preferred Study Mode:</label>
                <select
                  name="studyMode"
                  value={formData.studyMode}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Study Mode</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="input-field">
                <label>Comments (Optional):</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="register-btn">Submit Registration</button>
        </form>
      </div>
    </div>
  );
};

export default SemesterRegistration;
