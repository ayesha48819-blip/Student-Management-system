import Modal from "./Modal.jsx";
import StudentForm from "./StudentForm.jsx";

export default function EditStudentModal({ student, onSave, onClose }) {
  return (
    <Modal title="Edit Student" onClose={onClose}>
      <StudentForm initial={student} submitLabel="Update" savingLabel="Updating..." onSubmit={onSave} onCancel={onClose} />
    </Modal>
  );
}
