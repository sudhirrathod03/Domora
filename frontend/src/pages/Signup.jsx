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
    <div className=" flex flex-grow  items-center justify-center bg-[#E0F2FE] p-4">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create an Account
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          Join us to start booking your next stay.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="block text-sm font-semibold mb-4 text-gray-700"
          >
            Name
            <input
              required
              type="text"
              placeholder="Enter name"
              name="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
              className="mt-1 block w-full px-4 py-3 font-normal text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] transition-colors"
            />
          </label>

          <label
            htmlFor="email"
            className="block text-sm font-semibold mb-4 text-gray-700"
          >
            Email
            <input
              required
              type="email"
              placeholder="Enter email"
              name="email"
              id="email"
              onChange={handleChange}
              value={formData.email}
              className="mt-1 block w-full px-4 py-3 font-normal text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] transition-colors"
            />
          </label>

          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-6 text-gray-700"
          >
            Password
            <input
              required
              type="password"
              placeholder="Enter password"
              name="password"
              id="password"
              onChange={handleChange}
              value={formData.password}
              className="mt-1 block w-full px-4 py-3 font-normal text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] transition-colors"
            />
          </label>

          <button className="w-full bg-[#C2185B] cursor-pointer hover:opacity-90 text-white text-base font-semibold py-3 px-4 rounded-lg transition-opacity">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
