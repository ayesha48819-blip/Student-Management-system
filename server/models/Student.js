import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, "Student name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email address"]
    },
    fatherName: { type: String, required: [true, "Father's name is required"], trim: true, maxlength: 100 },
    courseName: { type: String, required: [true, "Course name is required"], trim: true },
    feeStructure: { type: Number, required: [true, "Fee is required"], min: [0, "Fee can't be negative"] },
    subjects: {
      type: [String],
      validate: { validator: (list) => list.length > 0, message: "Select at least one subject" }
    },
    classTiming: { type: String, required: [true, "Class timing is required"], trim: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
