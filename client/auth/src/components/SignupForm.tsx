import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
    navigate("/sign-up-confirm");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        margin: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignupForm;
