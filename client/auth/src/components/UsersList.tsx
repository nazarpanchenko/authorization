import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import $api from "../http";
import type { User } from "../types/auth";
import useAuth from "../hooks/useAuth";

function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const storedUser = localStorage.getItem("user");
  const currUser: User | null = storedUser ? JSON.parse(storedUser) : null;

  async function onDeleteUser(id: string) {
    try {
      await $api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      if (currUser?.id === id) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate("/sign-in");
      }
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await $api.get<User[]>("/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    })();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <h3>
        Current user: <span>{currUser?.email}</span>
      </h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            <p>
              ID: <span>{u.id}</span>&nbsp;
              {currUser && (
                <button type="button" onClick={() => onDeleteUser(u.id)}>
                  Delete
                </button>
              )}
            </p>
            <p>Email: {u.email}</p>
            <p>Activated: {u.isActivated ? "Yes" : "No"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;
