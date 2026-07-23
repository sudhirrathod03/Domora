import React, { useState } from "react";
import api from "../services/api.js";
const initialState = {
  name: "",
  email: "",
  password: "",
};

function Signup() {
  const [formData, setFormData] = useState(initialState);
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((form) => ({ ...form, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", formData);
      console.log(res);
      setFormData(initialState);
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name
          <input
            required
            type="text"
            placeholder="Enter name"
            name="name"
            id="name"
            onChange={handleChange}
            value={formData.name}
          />
        </label>

        <label htmlFor="email">
          Email
          <input
          required
            type="email"
            placeholder="Enter email"
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
          required
            type="password"
            placeholder="Enter password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
          />
        </label>
        <button>Submit</button>
      </form>
    </>
  );
}

export default Signup;
