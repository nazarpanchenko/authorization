import { useNavigate } from "react-router-dom";

export default function AuthConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div style={{ margin: "0 auto", textAlign: "center" }}>
      <h1>Account is successfully created</h1>
      <h2>
        You can now go to users page. In order to activate your account, follow
        verification link that has been sent to your email
      </h2>
      <p>
        <button type="button" onClick={() => navigate("/")}>
          Redirect
        </button>
      </p>
    </div>
  );
}
