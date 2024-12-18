import React from 'react';

const Features = () => {
  return (
    <section id="features" className="py-16 bg-slate-950">
      <div className="container mx-auto">
        <h2 className="text-center text-green-500">Our Features</h2>
        <h3 className="mt-2 text-3xl font-black text-center text-white">
          Designed to Simplify Attendance Management
        </h3>
        <div className="flex flex-wrap justify-center mt-10 space-x-4">
          {/* Feature 1 */}
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Real-Time Attendance</h4>
            <p className="mt-2 text-gray-600">
              Track attendance in real-time .
            </p>
          </div>
          {/* Feature 2 */}
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Biometric Integration</h4>
            <p className="mt-2 text-gray-600">
              Ensure accuracy and security .
            </p>
          </div>
          {/* Feature 3 */}
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Detailed Analytics</h4>
            <p className="mt-2 text-gray-600">
              Gain insights into employee attendance .
            </p>
          </div>
          {/* Feature 5 */}
          <div className="p-4 bg-white rounded shadow w-80">
            <h4 className="text-lg font-bold">Mobile App</h4>
            <p className="mt-2 text-gray-600">
              Manage attendance on the go with our user-friendly mobile app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
