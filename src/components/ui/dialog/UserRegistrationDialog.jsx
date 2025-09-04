import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  registerUser,
  resetRegistrationStatus,
} from "../../../redux/slice/userSlice.js";
import { setActiveTab } from "../../../redux/slice/dashboardSlice.js";

const UserRegistrationDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { registrationStatus, registrationError } = useSelector(
    (state) => state.user
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  useEffect(() => {
    if (registrationStatus === "succeeded") {
      toast.success(
        "User registered successfully! User will be active after admin approval.",
        { position: "top-right", autoClose: 5000 }
      );
      dispatch(setActiveTab("users"));
      onClose();
      dispatch(resetRegistrationStatus());
    }
  }, [registrationStatus, dispatch, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border ">
        <h2 className="text-2xl font-bold text-black mb-5">
          Register New User
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-white rounded border border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 bg-white rounded border border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full p-3 bg-white rounded border border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              required
              autoComplete="off"
            />
          </div>
          {registrationError && (
            <div className="text-red-600 text-sm font-semibold">
              {registrationError}
            </div>
          )}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={registrationStatus === "loading"}
              className="px-5 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition"
            >
              {registrationStatus === "loading" ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationDialog;
