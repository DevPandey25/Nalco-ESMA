const mongoose = require('mongoose');
const User = require('../models/userModel');
const { hashPassword } = require('../utils/securityUtils');

const connectDB = async () => {
    try {
        let uri = process.env.DB_CONNECTION_STRING;

        // Automatically launch a temporary local database if no connection string is provided
        if (!uri || uri.includes('your_mongodb_or_postgres_url_here')) {
            console.log('🔄 No remote MongoDB configured. Launching In-Memory MongoDB...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri);
        console.log(`🗄️ MongoDB Connected: ${conn.connection.host}`);

        // Seed initial users if database is empty
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('🌱 Database is empty of users. Seeding initial users...');
            const defaultPasswordHash = await hashPassword('password123');
            const seedUsers = [
                { personalNo: '10845', name: 'Probina Kumar Ray', email: process.env.TEST_RECIPIENT_EMAIL || 'probina@nalcoindia.co.in', role: 'Employee', designation: 'DM (HR)', password: defaultPasswordHash },
                { personalNo: '11308', name: 'Anita Das', email: 'anita@nalcoindia.co.in', role: 'Employee', designation: 'Assistant Manager', password: defaultPasswordHash },
                { personalNo: '11954', name: 'Rahul Mishra', email: 'rahul@nalcoindia.co.in', role: 'Employee', designation: 'Manager', password: defaultPasswordHash },
                { personalNo: '12041', name: 'Sushmita Sahoo', email: 'sushmita@nalcoindia.co.in', role: 'Employee', designation: 'Officer', password: defaultPasswordHash },
                { personalNo: '11776', name: 'Biswajit Nayak', email: 'biswajit@nalcoindia.co.in', role: 'Employee', designation: 'Senior Engineer', password: defaultPasswordHash },
                { personalNo: '12280', name: 'Madhumita Pradhan', email: 'madhumita@nalcoindia.co.in', role: 'Employee', designation: 'Executive', password: defaultPasswordHash },
                { personalNo: '12501', name: 'Debasis Mohanty', email: 'debasis@nalcoindia.co.in', role: 'Employee', designation: 'Engineer', password: defaultPasswordHash },
                { personalNo: '12823', name: 'Nirmal Patnaik', email: 'nirmal@nalcoindia.co.in', role: 'Employee', designation: 'Technician', password: defaultPasswordHash },
                { personalNo: '2001', name: 'A. K. Das', email: 'hod@nalcoindia.co.in', role: 'HOD', designation: 'Head of Department', password: defaultPasswordHash },
                { personalNo: '3001', name: 'R. Mohanty', email: 'ca@nalcoindia.co.in', role: 'Competent Authority', designation: 'Competent Authority', password: defaultPasswordHash },
                { personalNo: '4001', name: 'Prakash Behera', email: 'na@nalcoindia.co.in', role: 'Network Admin', designation: 'Network Administrator', password: defaultPasswordHash },
                { personalNo: '5001', name: 'ESMA System Admin', email: 'admin@nalcoindia.co.in', role: 'IT Admin', designation: 'IT Administrator', password: defaultPasswordHash }
            ];
            await User.insertMany(seedUsers);
            console.log('🌱 Hashed users seeded successfully.');
        }

        // Seed initial requests if the database is empty (important for testing role sync and metrics)
        const Request = require('../models/requestModel');
        const count = await Request.countDocuments();
        if (count === 0) {
            console.log('🌱 Database is empty. Seeding initial mock requests...');
            const seedRequests = [
                {
                    requestId: "ESMA-2026-0063",
                    employee: "Probina Kumar Ray",
                    email: "probina@nalcoindia.co.in",
                    employeeId: "10845",
                    designation: "DM (HR)",
                    department: "Administration",
                    unit: "CPP",
                    mediaType: "USB",
                    fromDate: new Date("2026-04-10"),
                    toDate: new Date("2026-04-19"),
                    status: "IMPLEMENTED",
                    currentStage: "Closed",
                    assignedTo: "Network Admin",
                    justification: "Transfer basis",
                    signatures: {
                        employeeSign: { name: "Probina Kumar Ray", timestamp: "2026-04-09 10:15", comment: "Submitted request", mode: "auto" },
                        hodSign: { name: "A. K. Das", timestamp: "2026-04-11 12:10", comment: "Recommended for approved HR transfer activity.", mode: "auto" },
                        caSign: { name: "R. Mohanty", timestamp: "2026-04-11 15:35", comment: "Approved with normal security controls.", mode: "auto" },
                        naSign: { name: "Prakash Behera", timestamp: "2026-04-19 17:20", comment: "Implemented and media access closed.", mode: "auto" }
                    },
                    comments: {
                        hod: "Recommended for approved HR transfer activity.",
                        ca: "Approved with normal security controls.",
                        na: "Implemented and media access closed."
                    }
                },
                {
                    requestId: "ESMA-2026-0064",
                    employee: "Anita Das",
                    email: "anita@nalcoindia.co.in",
                    employeeId: "11308",
                    designation: "Assistant Manager",
                    department: "Finance",
                    unit: "Smelter",
                    mediaType: "USB",
                    fromDate: new Date("2026-05-12"),
                    toDate: new Date("2026-05-14"),
                    status: "SUBMITTED",
                    currentStage: "HOD Recommendation",
                    assignedTo: "HOD",
                    justification: "Statutory audit data transfer",
                    signatures: {
                        employeeSign: { name: "Anita Das", timestamp: "2026-05-10 09:15", comment: "Submitted request", mode: "auto" }
                    }
                },
                {
                    requestId: "ESMA-2026-0065",
                    employee: "Rahul Mishra",
                    email: "rahul@nalcoindia.co.in",
                    employeeId: "11954",
                    designation: "Manager",
                    department: "IT",
                    unit: "Refinery",
                    mediaType: "External HDD",
                    fromDate: new Date("2026-05-16"),
                    toDate: new Date("2026-05-18"),
                    status: "RECOMMENDED",
                    currentStage: "Authority Approval",
                    assignedTo: "Competent Authority",
                    justification: "Patch archive transfer to isolated system",
                    signatures: {
                        employeeSign: { name: "Rahul Mishra", timestamp: "2026-05-10 10:22", comment: "Submitted request", mode: "auto" },
                        hodSign: { name: "A. K. Das", timestamp: "2026-05-10 11:40", comment: "Recommended for controlled transfer.", mode: "auto" }
                    },
                    comments: { hod: "Recommended for controlled transfer." }
                },
                {
                    requestId: "ESMA-2026-0066",
                    employee: "Sushmita Sahoo",
                    email: "sushmita@nalcoindia.co.in",
                    employeeId: "12041",
                    designation: "Officer",
                    department: "HR",
                    unit: "Mines",
                    mediaType: "CD",
                    fromDate: new Date("2026-05-07"),
                    toDate: new Date("2026-05-08"),
                    status: "REJECTED",
                    currentStage: "Rejected L1",
                    assignedTo: "Employee",
                    justification: "Employee records copy",
                    signatures: {
                        employeeSign: { name: "Sushmita Sahoo", timestamp: "2026-05-07 08:45", comment: "Submitted request", mode: "auto" },
                        hodSign: { name: "A. K. Das", timestamp: "2026-05-09 16:05", comment: "Business justification does not match approved media access purpose.", mode: "auto" }
                    },
                    comments: { hod: "Business justification does not match approved media access purpose." }
                },
                {
                    requestId: "ESMA-2026-0067",
                    employee: "Biswajit Nayak",
                    email: "biswajit@nalcoindia.co.in",
                    employeeId: "11776",
                    designation: "Senior Engineer",
                    department: "Projects",
                    unit: "Corporate Office",
                    mediaType: "USB",
                    fromDate: new Date("2026-05-15"),
                    toDate: new Date("2026-05-20"),
                    status: "APPROVED",
                    currentStage: "Network Implementation",
                    assignedTo: "Network Admin",
                    justification: "Vendor commissioning files",
                    signatures: {
                        employeeSign: { name: "Biswajit Nayak", timestamp: "2026-05-09 14:05", comment: "Submitted request", mode: "auto" },
                        hodSign: { name: "A. K. Das", timestamp: "2026-05-10 10:00", comment: "Recommended for project commissioning.", mode: "auto" },
                        caSign: { name: "R. Mohanty", timestamp: "2026-05-10 13:25", comment: "Approved for defined date range.", mode: "auto" }
                    },
                    comments: {
                        hod: "Recommended for project commissioning.",
                        ca: "Approved for defined date range."
                    }
                },
                {
                    requestId: "ESMA-2026-0068",
                    employee: "Madhumita Pradhan",
                    email: "madhumita@nalcoindia.co.in",
                    employeeId: "12280",
                    designation: "Executive",
                    department: "Commercial",
                    unit: "New Delhi",
                    mediaType: "Others",
                    fromDate: new Date("2026-05-21"),
                    toDate: new Date("2026-05-22"),
                    status: "DRAFT",
                    currentStage: "Submission",
                    assignedTo: "Employee",
                    justification: "Quotation archive preparation"
                },
                {
                    requestId: "ESMA-2026-0069",
                    employee: "Debasis Mohanty",
                    email: "debasis@nalcoindia.co.in",
                    employeeId: "12501",
                    designation: "Engineer",
                    department: "Operations",
                    unit: "Damanjodi",
                    mediaType: "USB",
                    fromDate: new Date("2026-05-18"),
                    toDate: new Date("2026-05-19"),
                    status: "SUBMITTED",
                    currentStage: "HOD Recommendation",
                    assignedTo: "HOD",
                    justification: "Shift log transfer",
                    signatures: {
                        employeeSign: { name: "Debasis Mohanty", timestamp: "2026-05-10 16:50", comment: "Submitted request", mode: "auto" }
                    }
                },
                {
                    requestId: "ESMA-2026-0070",
                    employee: "Nirmal Patnaik",
                    email: "nirmal@nalcoindia.co.in",
                    employeeId: "12823",
                    designation: "Technician",
                    department: "Maintenance",
                    unit: "Angul",
                    mediaType: "External SSD",
                    fromDate: new Date("2026-05-11"),
                    toDate: new Date("2026-05-13"),
                    status: "APPROVED",
                    currentStage: "Network Implementation",
                    assignedTo: "Network Admin",
                    justification: "Machine diagnostic logs",
                    signatures: {
                        employeeSign: { name: "Nirmal Patnaik", timestamp: "2026-05-10 12:25", comment: "Submitted request", mode: "auto" },
                        hodSign: { name: "A. K. Das", timestamp: "2026-05-10 14:30", comment: "Recommended for diagnostic review.", mode: "auto" },
                        caSign: { name: "R. Mohanty", timestamp: "2026-05-10 17:35", comment: "Approved.", mode: "auto" }
                    },
                    comments: {
                        hod: "Recommended for diagnostic review.",
                        ca: "Approved."
                    }
                }
            ];
            await Request.insertMany(seedRequests);
            console.log('🌱 Database seeded successfully with 8 mock requests.');
        }
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Do not exit process in dev if mongo isn't running locally, but normally process.exit(1)
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
