import { GraduationCap, LogIn } from "lucide-react";

export default function SignedOut({ onSignIn }) {
  return (
    <main className="signed-out">
      <div className="signed-out-card">
        <span className="signed-out-mark">
          <GraduationCap size={28} aria-hidden="true" />
        </span>
        <h1>You're logged out</h1>
        <p>Log back in to manage student records.</p>
        <button type="button" className="btn btn-primary btn-block" onClick={onSignIn} autoFocus>
          <LogIn size={17} aria-hidden="true" />
          Log in
        </button>
      </div>
    </main>
  );
}
