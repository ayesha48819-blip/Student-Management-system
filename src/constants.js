export const COURSES = [
  "BS Computer Science",
  "BS Software Engineering",
  "BS Information Technology",
  "BS Data Science",
  "MERN Stack Development"
];

export const SUBJECTS = [
  "Math",
  "Programming",
  "Database",
  "Data Structures",
  "Web Development",
  "Networking",
  "Physics",
  "English"
];

export const CLASS_TIMINGS = [
  "Morning (9:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 2:00 PM)",
  "Evening (2:00 PM - 5:00 PM)",
  "Weekend (Sat - Sun)"
];

export const formatFee = (amount) => `Rs ${Number(amount || 0).toLocaleString("en-PK")}`;
