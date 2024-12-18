import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserReq = () => {
  const [allReq, setAllReq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAllReq = async () => {
      try {
        const res = await fetch('/api/viewAllLeave', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAllReq(data);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch leave requests');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllReq();
  }, []);

  const totalPages = Math.ceil(allReq.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentRows = allReq.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = (id, value) => {
    setAllReq((prev) =>
      prev.map((req) => (req._id === id ? { ...req, status: value } : req))
    );
  };

  const handleSubmit = async (leaveId) => {
    const leave = allReq.find((req) => req._id === leaveId);
    if (!leave) return;

    try {
      const res = await fetch(`/api/updateLeave/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: leave.status }),
      });

      if (res.ok) {
        toast.success('Leave request status updated successfully!');
      } else {
        toast.error('Failed to update leave request status');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while updating the leave request status.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <ToastContainer/>
      <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">No.</th>
            <th className="py-2 px-4 border-b">Employee Id</th>
            <th className="py-2 px-4 border-b">Leave Type</th>
            <th className="py-2 px-4 border-b">Start Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Reason</th>
            <th className="py-2 px-4 border-b">Request Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((leave, index) => (
            <tr key={leave._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{startRow + index + 1}</td>
              <td className="py-2 px-4 border-b">{leave.employee_Id}</td>
              <td className="py-2 px-4 border-b">{leave.leaveType}</td>
              <td className="py-2 px-4 border-b">{leave.startDate}</td>
              <td className="py-2 px-4 border-b">{leave.endDate}</td>
              <td className="py-2 px-4 border-b">{leave.reason}</td>
              <td className="py-2 px-4 border-b">{new Date(leave.requestDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
                <select
                  className="border border-gray-300 rounded p-1"
                  value={leave.status}
                  onChange={(e) => handleStatusChange(leave._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  onClick={() => handleSubmit(leave._id)}
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 ${
              currentPage === index + 1
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-black'
            } rounded-lg`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserReq;
