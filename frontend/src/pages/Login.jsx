import React, { useState } from "react";
import api from "../services/api";

const initialState = {
  email: "",
  password: "",
};
function Login() {
  const [formData, setFormData] = useState(initialState);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((form) => ({ ...form, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", formData);
      console.log(res);
      setFormData(initialState);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">
        Email
        <input
        required
          type="email"
          placeholder="Enter email"
          value={formData.email}
          name="email"
          id="email"
          onChange={handleChange}
        />
      </label>

      <label htmlFor="password">
        Password
        <input
        required
          type="password"
          placeholder="Enter password"
          value={formData.password}
          name="password"
          id="password"
          onChange={handleChange}
        />
      </label>
      <button>Submit</button>
    </form>
  );
}

export default Login;
