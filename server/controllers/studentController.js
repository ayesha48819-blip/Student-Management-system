import mongoose from "mongoose";
import Student from "../models/Student.js";

const FIELDS = ["studentName", "email", "fatherName", "courseName", "feeStructure", "subjects", "classTiming", "status"];

// Only accept known fields from the request body
const pickFields = (body = {}) =>
  Object.fromEntries(FIELDS.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

function notFound() {
  const error = new Error("Student not found");
  error.status = 404;
  return error;
}

function checkId(id) {
  if (!mongoose.isValidObjectId(id)) throw notFound();
}

// GET /api/students
export async function getStudents(_req, res) {
  const students = await Student.find().sort({ createdAt: -1, _id: -1 });
  res.json(students);
}

// GET /api/students/:id
export async function getStudentById(req, res) {
  checkId(req.params.id);
  const student = await Student.findById(req.params.id);
  if (!student) throw notFound();
  res.json(student);
}

// POST /api/students
export async function createStudent(req, res) {
  const student = await Student.create(pickFields(req.body));
  res.status(201).json(student);
}

// PUT /api/students/:id
export async function updateStudent(req, res) {
  checkId(req.params.id);
  const student = await Student.findByIdAndUpdate(req.params.id, pickFields(req.body), {
    new: true,
    runValidators: true
  });
  if (!student) throw notFound();
  res.json(student);
}

// DELETE /api/students/:id
export async function deleteStudent(req, res) {
  checkId(req.params.id);
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) throw notFound();
  res.json({ message: "Student deleted", id: student._id });
}
