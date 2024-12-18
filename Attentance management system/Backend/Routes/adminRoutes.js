import { json, response, Router } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authenticate } from "../Middleware/auth.js";
import mongoose from 'mongoose';
import moment from 'moment';



const Route = Router()

const secretKey = process.env.secretKey;

//LeaveRequestSchema
const LeaveRequestSchema = new mongoose.Schema({
    employee_Id: { type: String, required: true },
    leaveType: { type: String, enum: ['sick', 'vacation', 'casual'], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    requestDate: { type: Date, default: Date.now }
});

//userSchema
const userSchema = new mongoose.Schema(
    {
        Name: String,
        employeeId: { type: String, unique: true },
        department: String,
        Password: String,
        Role: String
    }
)

//attendanceSchema
const attendanceSchema = new mongoose.Schema({
    employee_Id: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'leave'], default: 'present' },
    timestamp: { type: Date, default: Date.now } // Capture exact time of marking attendance
})

//create model for user
const user = mongoose.model('userDetails', userSchema)

//create model for leaveRequest
const leave = mongoose.model('leaveRequest', LeaveRequestSchema)

//create model for attentance
const attendance = mongoose.model('attendanceUpdate', attendanceSchema)

mongoose.connect('mongodb://localhost:27017/Attandance_Management')


Route.post('/signup', async (req, res) => {
    try {
        const { Name, employeeId, department, Password, Role } = req.body;

        // Validate request body
        if (!Name || !employeeId || !department || !Password || !Role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await user.findOne({ employeeId: employeeId });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Create new user
        const newUser = new user({
            Name: Name,
            employeeId: employeeId,
            department: department,
            Password: hashedPassword,
            Role: Role
        });

        // Save the user in the database
        await newUser.save();

        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


Route.post('/login', async (req, res) => {
    const data = req.body;
    console.log(data);
    
    const { Name, Password } = data;

    const result = await user.findOne({ Name: Name })
    console.log(result);

    if (result.Role=="employee"||"admin") {
        console.log(Password)
        const invalid = await bcrypt.compare(Password, result.Password);
        console.log(invalid);
        if (invalid) {

            const token = jwt.sign({ Name: Name, Role: result.Role }, secretKey, { expiresIn: "1h" })
            console.log(token)
            res.cookie('authToken', token, {
                httpOnly: true
            });
            res.status(200).json({ message: "Success",data:result })
        }
        else {
            res.status(403).json({ Message: "Password Is not Correct" })
        }

    }
    else {
        res.status(403).json({ message: "User is not exist" })
    }

})



Route.post('/logout', authenticate, (req, res) => {
    try {
        if (req.Role) {
            res.clearCookie('authToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

});

Route.post('/leaveRequest', authenticate, async (req, res) => {
    try {
        const { employee_Id, leaveType, startDate, endDate, reason } = req.body;

        // Ensure that all necessary fields are present
        if (!employee_Id || !leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the employee exists
        const existingUser = await user.findOne({ employeeId: employee_Id });
        if (!existingUser) {
            return res.status(400).json({ message: "Employee ID not found" });
        }

        // Check if the employee already has a leave request for today
        const today = moment().startOf('day');
        const existingLeave = await leave.findOne({
            employee_Id: employee_Id,
            requestDate: { $gte: today.toDate(), $lt: moment(today).endOf('day').toDate() },
        });

        if (existingLeave) {
            return res.status(400).json({ message: "You have already submitted a leave request today" });
        }

        // Create the new leave request
        const newLeaveRequest = new leave({
            employee_Id: employee_Id,
            leaveType: leaveType,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason: reason,
            requestDate: moment().toDate(),  // Add a request date if needed
        });

        // Save the new leave request to the database
        await newLeaveRequest.save();

        res.status(200).json({leave: newLeaveRequest });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing leave request', error: error.message });
    }
});


Route.post('/markAttendance', async (req, res) => {
    try {
      const { employee_Id, date, status } = req.body;
  
      // Check if employee exists
      const existingUser = await user.findOne({ employeeId: employee_Id });
      if (!existingUser) {
        return res.status(400).json({ message: 'Invalid employee ID.' });
      }
  
      // Normalize date to compare without time
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
  
      // Check if attendance is already marked
      const existingAttendance = await attendance.findOne({
        employee_Id,
        date: attendanceDate,
      });
      if (existingAttendance) {
        return res.status(400).json({ message: 'Attendance already marked for this date.' });
      }
  
      // Create new attendance record
      const newAttendance = new attendance({
        employee_Id,
        date: attendanceDate,
        status,
        timestamp: new Date(),
      });
  
      await newAttendance.save();
      res.status(200).json({ message: 'Attendance marked successfully.', attendance: newAttendance });
    } catch (error) {
      console.error('Error marking attendance:', error);
      res.status(500).json({ message: 'An error occurred while marking attendance.', error });
    }
  });

Route.post('/addUser', authenticate, async (req, res) => {
    try {
        console.log('Hello')
        console.log(req.Name);
        console.log(req.Role);

        const { Name, employeeId, department, Password, Role } = req.body
        console.log(Name);

        if (req.Role == "admin") {
            const existingUser = await user.findOne({ employeeId: employeeId })


            if (existingUser) {
                res.status(400).json({ message: "User already exist" })
            }
            else {
                const newUser = new user({
                    Name: Name,
                    employeeId: employeeId,
                    department: department,
                    Password: Password,
                    Role: Role
                });
                await newUser.save()
                res.status(200).json({ message: "User added successfully" })

            }
        }
        else {
            res.status(400).json({ message: 'User Is Not Admin' })
            console.log("User Is Not Admin")

        }


    } catch (error) {
        res.status(500).json(error);

    }

})

//update user
Route.patch('/updateUser', authenticate, async (req, res) => {
    try {
        console.log('Hello');
        console.log(req.Name);

        const { Name, employeeId, department, Password } = req.body;

        if (req.Role === "admin") {
            // Update user document with the given employeeId
            const result = await user.findOneAndUpdate(
                { employeeId: employeeId },
                {
                    $set: {
                        Name: Name,
                        department: department,
                        Password: Password
                    }
                },
                { new: true } // return the updated document
            );

            if (!result) {
                // If no document was found with the given employeeId
                return res.status(400).json({ message: "User not found" });
            }

            res.status(200).json({ message: "User updated successfully", updatedUser: result });
        } else {
            res.status(400).json({ message: "Unauthorized Access" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred. Please check the user details.", error });
    }
});

Route.delete('/deleteUser/:cid', authenticate, async (req, res) => {
    const employeeId = req.params.cid
    try {
        const result = await user.findOneAndDelete({ _id : employeeId })
        if (result) {
            res.status(200).json("employ deleted")
        }
        else {
            res.status(400).json("employ is not found")
        }
    }
    catch (error) {
        res.status(500).json({ message: "An error occurred. Please check the user details.", error });
    }
})

Route.get('/searchUser/:search', async (req, res) => {

    try {

        const search = req.params.search;

        const result = await user.findOne({ employeeId: search })
        if (result) {
            res.status(200).json({ data: result })
        } else {
            res.status(404).json({ message: "user not found" })
        }

    } catch (err) {
        console.log(err);

    }
});


Route.get('/viewUser', authenticate, (req, res) => {
    const user = req.Role
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({ message: "data not found" })
    }
})

Route.get('/viewAll', authenticate, async (req, res) => {
    try {
        const allUsers = await user.find({ Role: 'employee' });
        if (allUsers.length > 0) {
            res.status(200).json(allUsers);
        } else {
            res.status(404).json({ message: 'No employees found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//view all leave by id
Route.get('/viewallLeavebyid/:id', async (req, res) => {
    try {
        const Eleave = req.params.id
        const allLeave = await leave.find({employee_Id:Eleave});
        if (allLeave.length > 0) {
            res.status(200).json(allLeave);
        } else {
            res.status(404).json({ message: 'No leaves found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//view all leave 
Route.get('/viewAllLeave', async (req, res) => {
    try {
        const allLeave = await leave.find();
        if (allLeave.length > 0) {
            res.status(200).json(allLeave);
        } else {
            res.status(404).json({ message: 'No leaves found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//view all attentance
Route.get('/viewAllattentance', authenticate, async (req, res) => {
    try {
        const allattendance = await attendance.find();
        if (allattendance.length > 0) {
            res.status(200).json(allattendance);
        } else {
            res.status(404).json({ message: 'No employees found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//view attentance by id
Route.get('/viewattentancebyid/:id', async (req, res) => {
    try {
        const empid = req.params.id
        const attend = await attendance.findOne({employee_Id:empid});
        if (attend) {
            res.status(200).json(attend);
        } else {
            res.status(404).json({ message: 'No Attentance found with with this employee id' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

//one employee all attentance 
Route.get('/viewallattentanceOnePersonbyid/:id', async (req, res) => {
    try {
        const empid = req.params.id
        const attend = await attendance.find({employee_Id:empid});
        if (attend) {
            res.status(200).json(attend);
        } else {
            res.status(404).json({ message: 'No Attentance found with with this employee id' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

Route.get('/viewallattentanceToday', async (req, res) => {
    try {
        // Get today's date and format it as 'YYYY-MM-DD'
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);  // Set to midnight
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);  // Set to end of the day

        console.log(`Today's range: ${todayStart} to ${todayEnd}`);

        // Find attendance records for today by checking if the timestamp is within today's date range
        const attend = await attendance.find({
            timestamp: { $gte: todayStart, $lt: todayEnd }
        });

        if (attend && attend.length > 0) {
            res.status(200).json(attend);
        } else {
            res.status(404).json({ message: 'No attendance found for today' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});



Route.get('/adminName',async(req,res)=>{
    try{
        const adminName = await user.find({Role:'admin'})
        if (adminName) {
            res.status(200).json({ data: adminName })
        } else {
            res.status(404).json({ message: "user not found" })
        }
    }
    catch{
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})

//for getting employee data for leave request
Route.get('/employee/:name',async(req,res)=>{

    try {
        const empName = req.params.name
        console.log(empName);
        
    
        const Result = await user.findOne({Name:empName})
        if(!Result){
           return res.status(400).json({message:"User not Found"})
        }else{
            console.log(Result)
           return res.status(200).json({Result})
            
        }
    } catch (error) {
        console.log(error);
        
    }

})

//for getting employeeid only for mark attentance
Route.get('/employeeidOnly/:name', async (req, res) => {
    try {
      const empName = req.params.name;
      console.log(empName);
  
      // Find the user by name
      const Result = await user.findOne({ Name: empName });
      
      if (!Result) {
        return res.status(400).json({ message: "User not found" });
      } else {
        // Send only employeeId in the response
        console.log(Result); // Log the full result to see the structure
        return res.status(200).json({ employeeId: Result.employeeId });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  
Route.put('/attentanceUpadte/:id',async(req,res)=>{

    const {id} = req.params
    
    const newStatus = req.body;

        try {
            const updatedatt = await attendance.findOneAndUpdate(
                { id }, // Find the attentance by its id
                newStatus, // Update the attentance with the new data
                { new: true } // Return the updated attentance
              );
              if (!updatedatt) {
                return res.status(404).json({ message: 'Dish not found' });
              }
              res.status(200).json(updatedatt); // Return the updated attentance details
            } catch (error) {
              res.status(500).json({ message: 'Error updating dish', error: error.message });
            }
    
})

Route.put('/updateLeave/:id', async (req, res) => {
    const { id } = req.params; // Extract leave request ID from URL
    const { status } = req.body; // Extract status from the request body
  
    // Validate the request body
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value. Allowed values are pending, approved, or rejected.' });
    }
  
    try {
      // Find the leave request by ID and update the status
      const updatedLeave = await leave.findByIdAndUpdate(
        id,
        { status }, // Update the status
        { new: true } // Return the updated document
      );
  
      if (!updatedLeave) {
        return res.status(404).json({ message: 'Leave request not found' });
      }
  
      // Respond with the updated leave request
      res.status(200).json({
        message: 'Leave request status updated successfully',
        data: updatedLeave,
      });
    } catch (error) {
      console.error('Error updating leave request:', error);
      res.status(500).json({
        message: 'Error updating leave request',
        error: error.message,
      });
    }
  });


export { Route };