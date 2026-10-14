const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import Model Student vừa tạo
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API backend đang chạy',
    endpoints: {
      students: '/api/students'
    }
  });
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Thiếu biến môi trường MONGODB_URI trong file .env');
}


// ==========================================
// CÂU 36: API GET /api/students
// ==========================================
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
  }
});

// ==========================================
// CÂU 37: API POST /api/students
// ==========================================
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;
    const newStudent = await Student.create({ studentId, name, email });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi tạo sinh viên', error: error.message });
  }
});

// ==========================================
// CÂU 38: API PUT /api/students/:id
// ==========================================
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: 'Lỗi cập nhật', error: error.message });
  }
});

// ==========================================
// CÂU 39: API DELETE /api/students/:id
// ==========================================
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }
    res.status(200).json({ message: 'Xóa sinh viên thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi xóa sinh viên', error: error.message });
  }
});


// Kết nối cơ sở dữ liệu trước khi khởi động server.
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log('Da ket noi thanh cong MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`Server dang chay tai port ${PORT}`);
    });
  } catch (error) {
    console.error('Loi ket noi MongoDB Atlas:', error.message);
    process.exitCode = 1;
  }
}

startServer();