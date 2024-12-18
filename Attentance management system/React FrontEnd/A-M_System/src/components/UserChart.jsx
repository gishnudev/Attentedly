import React, { useState, useEffect } from "react";

//userDash Components

const ParentComponent = () => {
  const [att, setAtt] = useState(null);
  const [leave, setLeave] = useState(null);
  const [empid, setEmpid] = useState(null);
  const [error, setError] = useState(null);
  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [activeTab, setActiveTab] = useState("attendance");

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
        setEmpid(data.employeeId);
      } catch (err) {
        console.error("Error fetching employee ID:", err);
        setError("Failed to load employee information");
      }
    };

    fetchEmployeeId();
  }, []);

  useEffect(() => {
    if (empid) {
      const fetchAttendance = async () => {
        try {
          const res = await fetch(`/api/viewallattentanceOnePersonbyid/${empid}`);

          if (res.ok) {
            const attData = await res.json();
            setAtt(attData);
            const percentage = calculateAttendancePercentage(attData);
            setAttendancePercentage(percentage);
          } else {
            console.error("Failed to fetch attendance");
            setAtt([]);
            setAttendancePercentage(0);
          }
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      };

      const calculateAttendancePercentage = (attData) => {
        const totalRecords = attData.length;
        const presentCount = attData.filter((record) => record.status === "present").length;
        return ((presentCount / totalRecords) * 100).toFixed(2);
      };

      fetchAttendance();
    }
  }, [empid]);

  useEffect(() => {
    if (empid) {
      const fetchLeaveRequests = async () => {
        try {
          const res = await fetch(`/api/viewallLeavebyid/${empid}`);
          if (res.ok) {
            const leaveData = await res.json();
            setLeave(leaveData);
          } else {
            console.error("Failed to fetch leave requests");
            setLeave([]);
          }
        } catch (error) {
          console.error("Error fetching leave requests:", error);
        }
      };

      fetchLeaveRequests();
    }
  }, [empid]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && <div className="text-red-500 mb-4 p-3 bg-red-100 rounded-md">{error}</div>}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "attendance" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("attendance")}
        >
          Attendance
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "leave" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("leave")}
        >
          Leave Requests
        </button>
      </div>
      {activeTab === "attendance" && (
        <UserChart empid={empid} att={att} attendancePercentage={attendancePercentage} />
      )}
      {activeTab === "leave" && <LeaveRequests leave={leave} />}
    </div>
  );
};

const UserChart = ({ empid, att, attendancePercentage }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Attendance</h2>
    {empid ? (
      <div>
        <p>
          <strong>Employee ID:</strong> {empid}
        </p>
        {attendancePercentage !== null && (
          <p>
            <strong>Attendance Percentage:</strong> {attendancePercentage}%
          </p>
        )}
        {att && att.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Attendance Details:</h3>
            <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {att.map((attendance, index) => (
                  <tr key={index} className="border-b hover:bg-gray-200">
                    <td className="py-2 px-4">{attendance.date}</td>
                    <td className="py-2 px-4">{attendance.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No attendance data available.</p>
        )}
      </div>
    ) : (
      <p>Loading employee ID...</p>
    )}
  </div>
);

const LeaveRequests = ({ leave }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave Requests</h2>
    {leave && leave.length > 0 ? (
      <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="py-2 px-4 text-left">Leave Date</th>
            <th className="py-2 px-4 text-left">Reason</th>
            <th className="py-2 px-4 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {leave.map((leaveRequest, index) => (
            <tr key={index} className="border-b hover:bg-gray-200">
              <td className="py-2 px-4">{leaveRequest.requestDate}</td>
              <td className="py-2 px-4">{leaveRequest.reason}</td>
              <td className="py-2 px-4">{leaveRequest.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No leave requests available.</p>
    )}
  </div>
);

export default ParentComponent;