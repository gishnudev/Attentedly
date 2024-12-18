import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    employee_Id: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch employee ID on component mount
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const employeeName = localStorage.getItem("Name");
  
        if (!employeeName) {
          setError("Employee name not found in localStorage");
          return;
        }
  
        const response = await fetch(`/api/employeeidOnly/${employeeName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch employee ID");
        }
  
        const data = await response.json();
        setFormData((prevData) => ({
          ...prevData,
          employee_Id: data.employeeId || "",
        }));
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to load employee information");
      }
    };
  
    fetchEmployeeId();
  }, []);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError("Start date cannot be later than end date");
      return;
    }
  
    try {
      const response = await fetch("/api/leaveRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "An error occurred while submitting the request");
      }
  
      setMessage(data.message);
      setFormData({
        employee_Id: formData.employee_Id,
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
      });
      toast.success("Leave requested sucessfully")
    } catch (err) {
      console.error("Error submitting leave request:", err);
      setError(err.message || "An error occurred while submitting the request");
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <ToastContainer/>
      <h2 className="text-2xl font-bold mb-4">Leave Request</h2>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee ID Field (Read-Only) */}
        <div>
          <label htmlFor="employee_Id" className="block text-gray-700 font-medium">
            Employee ID
          </label>
          <input
            type="text"
            id="employee_Id"
            name="employee_Id"
            value={formData.employee_Id}  // This will set the value from state
            onChange={handleChange}  // This will be disabled since it's read-only
            className="w-full border border-gray-300 rounded-lg p-2"
            readOnly
            required
          />
        </div>
        {/* Leave Type Field */}
        <div>
          <label htmlFor="leaveType" className="block text-gray-700 font-medium">
            Leave Type
          </label>
          <select
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Select Leave Type</option>
            <option value="sick">Sick Leave</option>
            <option value="vacation">Vacation Leave</option>
            <option value="casual">Casual Leave</option>
          </select>
        </div>

        {/* Start Date Field */}
        <div>
          <label htmlFor="startDate" className="block text-gray-700 font-medium">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* End Date Field */}
        <div>
          <label htmlFor="endDate" className="block text-gray-700 font-medium">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          />
        </div>

        {/* Reason Field */}
        <div>
          <label htmlFor="reason" className="block text-gray-700 font-medium">
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700"
          >
            Submit Leave Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequest;
