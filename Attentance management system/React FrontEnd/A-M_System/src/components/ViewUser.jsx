import React, { useEffect, useState } from 'react';

const ViewUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('/api/viewAll', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAllUsers(data);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const totalPages = Math.ceil(allUsers.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentRows = allUsers.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        console.log(userId);
        
        const res = await fetch(`/api/deleteUser/${userId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          alert('User deleted successfully!');
          setAllUsers((prev) => prev.filter((user) => user._id !== userId));
        } else {
          alert('Failed to delete user');
        }
      } catch (err) {
        console.error(err);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/updateUser', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        alert(data.message);
        setEditingUser(null);
        setAllUsers((prev) =>
          prev.map((user) =>
            user._id === data.updatedUser._id ? data.updatedUser : user
          )
        );
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update user');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the user.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Number</th>
            <th className="py-2 px-4 border-b">User ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Department</th>
            <th className="py-2 px-4 border-b">Password</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((user, index) => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{startRow + index + 1}</td>
              <td className="py-2 px-4 border-b">{user.employeeId}</td>
              <td className="py-2 px-4 border-b">{user.Name}</td>
              <td className="py-2 px-4 border-b">{user.department}</td>
              <td className="py-2 px-4 border-b">{user.Password}</td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-md"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
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

      {/* Edit User Form */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="Name"
                  value={editingUser.Name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={editingUser.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="Password"
                  value={editingUser.Password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewUser;
