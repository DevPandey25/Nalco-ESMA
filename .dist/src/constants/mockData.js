import { createRequest, signSeed } from '../utils/requestFactory.js';

export const initialRequests = [
  createRequest({
    id: "ESMA-2026-0063",
    employeeName: "Probina Kumar Ray",
    personalNo: "10845",
    designation: "DM (HR)",
    department: "Administration",
    unit: "CPP",
    media: "USB",
    fromDate: "2026-04-10",
    toDate: "2026-04-19",
    status: "IMPLEMENTED",
    assignedTo: "Network Admin",
    priority: "medium",
    justification: "Transfer basis",
    lastUpdated: "2026-04-19 17:20",
    signatures: {
      employeeSign: signSeed("Probina Kumar Ray", "2026-04-09 10:15"),
      hodSign: signSeed("A. K. Das", "2026-04-11 12:10", "Recommended for approved HR transfer activity."),
      caSign: signSeed("R. Mohanty", "2026-04-11 15:35", "Approved with normal security controls."),
      naSign: signSeed("Prakash Behera", "2026-04-19 17:20", "Implemented and media access closed.")
    },
    comments: {
      hod: "Recommended for approved HR transfer activity.",
      ca: "Approved with normal security controls.",
      na: "Implemented and media access closed."
    }
  }),
  createRequest({
    id: "ESMA-2026-0064",
    employeeName: "Anita Das",
    personalNo: "11308",
    designation: "Assistant Manager",
    department: "Finance",
    unit: "Smelter",
    media: "USB",
    fromDate: "2026-05-12",
    toDate: "2026-05-14",
    status: "SUBMITTED",
    assignedTo: "HOD",
    priority: "high",
    justification: "Statutory audit data transfer",
    lastUpdated: "2026-05-10 09:15",
    signatures: {
      employeeSign: signSeed("Anita Das", "2026-05-10 09:15")
    }
  }),
  createRequest({
    id: "ESMA-2026-0065",
    employeeName: "Rahul Mishra",
    personalNo: "11954",
    designation: "Manager",
    department: "IT",
    unit: "Refinery",
    media: "External HDD",
    fromDate: "2026-05-16",
    toDate: "2026-05-18",
    status: "RECOMMENDED",
    assignedTo: "Competent Authority",
    priority: "medium",
    justification: "Patch archive transfer to isolated system",
    lastUpdated: "2026-05-10 11:40",
    signatures: {
      employeeSign: signSeed("Rahul Mishra", "2026-05-10 10:22"),
      hodSign: signSeed("A. K. Das", "2026-05-10 11:40", "Recommended for controlled transfer.")
    },
    comments: { hod: "Recommended for controlled transfer." }
  }),
  createRequest({
    id: "ESMA-2026-0066",
    employeeName: "Sushmita Sahoo",
    personalNo: "12041",
    designation: "Officer",
    department: "HR",
    unit: "Mines",
    media: "CD",
    fromDate: "2026-05-07",
    toDate: "2026-05-08",
    status: "REJECTED_L1",
    assignedTo: "Employee",
    priority: "low",
    justification: "Employee records copy",
    lastUpdated: "2026-05-09 16:05",
    rejectionReason: "Business justification does not match approved media access purpose.",
    signatures: {
      employeeSign: signSeed("Sushmita Sahoo", "2026-05-07 08:45"),
      hodSign: signSeed("A. K. Das", "2026-05-09 16:05", "Business justification does not match approved media access purpose.")
    },
    comments: { hod: "Business justification does not match approved media access purpose." }
  }),
  createRequest({
    id: "ESMA-2026-0067",
    employeeName: "Biswajit Nayak",
    personalNo: "11776",
    designation: "Senior Engineer",
    department: "Projects",
    unit: "Corporate Office",
    media: "USB",
    fromDate: "2026-05-15",
    toDate: "2026-05-20",
    status: "APPROVED",
    assignedTo: "Network Admin",
    priority: "high",
    justification: "Vendor commissioning files",
    lastUpdated: "2026-05-10 13:25",
    signatures: {
      employeeSign: signSeed("Biswajit Nayak", "2026-05-09 14:05"),
      hodSign: signSeed("A. K. Das", "2026-05-10 10:00", "Recommended for project commissioning."),
      caSign: signSeed("R. Mohanty", "2026-05-10 13:25", "Approved for defined date range.")
    },
    comments: {
      hod: "Recommended for project commissioning.",
      ca: "Approved for defined date range."
    }
  }),
  createRequest({
    id: "ESMA-2026-0068",
    employeeName: "Madhumita Pradhan",
    personalNo: "12280",
    designation: "Executive",
    department: "Commercial",
    unit: "New Delhi",
    media: "Others",
    fromDate: "2026-05-21",
    toDate: "2026-05-22",
    status: "DRAFT",
    assignedTo: "Employee",
    priority: "low",
    justification: "Quotation archive preparation",
    lastUpdated: "2026-05-10 15:12"
  }),
  createRequest({
    id: "ESMA-2026-0069",
    employeeName: "Debasis Mohanty",
    personalNo: "12501",
    designation: "Engineer",
    department: "Operations",
    unit: "Damanjodi",
    media: "USB",
    fromDate: "2026-05-18",
    toDate: "2026-05-19",
    status: "SUBMITTED",
    assignedTo: "HOD",
    priority: "medium",
    justification: "Shift log transfer",
    lastUpdated: "2026-05-10 16:50",
    signatures: {
      employeeSign: signSeed("Debasis Mohanty", "2026-05-10 16:50")
    }
  }),
  createRequest({
    id: "ESMA-2026-0070",
    employeeName: "Nirmal Patnaik",
    personalNo: "12823",
    designation: "Technician",
    department: "Maintenance",
    unit: "Angul",
    media: "External SSD",
    fromDate: "2026-05-11",
    toDate: "2026-05-13",
    status: "APPROVED",
    assignedTo: "Network Admin",
    priority: "high",
    justification: "Machine diagnostic logs",
    lastUpdated: "2026-05-10 17:35",
    signatures: {
      employeeSign: signSeed("Nirmal Patnaik", "2026-05-10 12:25"),
      hodSign: signSeed("A. K. Das", "2026-05-10 14:30", "Recommended for diagnostic review."),
      caSign: signSeed("R. Mohanty", "2026-05-10 17:35", "Approved.")
    },
    comments: {
      hod: "Recommended for diagnostic review.",
      ca: "Approved."
    }
  })
];
