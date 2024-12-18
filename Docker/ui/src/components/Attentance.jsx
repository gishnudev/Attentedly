import React, { useEffect, useState } from 'react';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch attendance data
  const fetchAttendance = async () => {
    try {
      const response = await fetch('/api/viewAllattentance');
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setAttendanceData(data);
      console.log(data);
      
    } catch (error) {
      console.error('Server error:', error);
      setError(error.message);
    }
  };

  // Group and sort attendance by employee ID
  const groupAttendanceByEmployeeId = () => {
    const groupedData = attendanceData.reduce((acc, record) => {
      if (!acc[record.employee_Id]) {
        acc[record.employee_Id] = [];
      }
      acc[record.employee_Id].push(record);
      return acc;
    }, {});

    // Sort employee IDs in numeric order
    const sortedKeys = Object.keys(groupedData).sort((a, b) => Number(a) - Number(b));
    return sortedKeys.map((key) => ({
      employee_Id: key,
      records: groupedData[key],
    }));
  };

  // Calculate attendance percentage
  const calculateAttendancePercentage = (records) => {
    const totalRecords = records.length;
    console.log("totalRecords",totalRecords);
    
    const presentCount = records.filter((record) => record.status === 'present').length;
    console.log("presentCount",presentCount);
    return ((presentCount / totalRecords) * 100).toFixed(2);
  };

  //No of absent taken
  const findAbsent = (records) =>{

    const absentCount = records.filter((record) => record.status === 'absent').length;
    return(absentCount)
  }

  //No of leave taken
  const findLeavestaken = (records) =>{

    const leaveCounts = records.filter((record) => record.status === 'leave').length;
    return(leaveCounts)
  }


  const renderEmployeePage = () => {
    const groupedData = groupAttendanceByEmployeeId();

    if (groupedData.length === 0) return <p>No attendance data available.</p>;

    // Ensure the current page does not exceed the available employee data
    const { employee_Id, records } = groupedData[currentPage - 1];
    const attendancePercentage = calculateAttendancePercentage(records);
    const absentCount = findAbsent(records);
    const leaveCounts = findLeavestaken(records);



    return (
      <div key={employee_Id} className="mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-2">Employee ID: {employee_Id}</h2>
        <p className="text-sm text-gray-600"><strong>Attendance Percentage:</strong> {attendancePercentage}%</p>
        <p className="text-sm text-gray-600"><strong>Number of Absents:</strong> {absentCount}</p>
        <p className="text-sm text-gray-600"><strong>Number of Leaves:</strong> {leaveCounts}</p>
        <div className="overflow-auto max-h-[700px] mt-4">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Index No</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">{index + 1}</td>
                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">{record.date}</td>
                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">{record.status}</td>
                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-800">{record.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const groupedData = groupAttendanceByEmployeeId();
  const totalPages = groupedData.length;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Attendance Records</h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <>
          <div className="mb-8 h-[400px]">{renderEmployeePage()}</div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;
