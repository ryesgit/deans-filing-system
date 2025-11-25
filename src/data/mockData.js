export const userData = {
  name: "JHAY MARK ORTIZ LUIZ",
  email: "jhaymarkluis@gmail.com",
  idNumber: "ADM-001",
  role: "Admin",
  department: "Computer Engineering",
  gender: "Male",
  contactNumber: "0977 867 1234",
  dateOfBirth: "12/14/2003",
  accountStatus: "Active",
  lastLogin: "10/22/2025– 2:45 PM",
  avatar: "https://c.animaapp.com/27o9iVJi/img/profile-01.svg"
};

export const statsData = {
  files: {
    total: 120,
    newlyAdded: 32
  },
  borrowing: {
    activeBorrowed: 2240,
    returnedToday: 55
  },
  approvals: {
    pending: 40,
    approved: 22
  },
  overdueFiles: {
    overdue: 320,
    resolved: 2240
  }
};

export const recentRequests = [
  {
    id: "REQ-0001",
    facultyName: "Prof. Ben Cruz",
    department: "Computer Engineering",
    fileName: "DeptReport_Q3.pdf",
    dateRequested: "Oct 22, 2025",
    status: "approved"
  },
  {
    id: "REQ-0002",
    facultyName: "Prof. Ado Dela Peña",
    department: "Electrical Engineering",
    fileName: "ThesisGuidelines2025.pdf",
    dateRequested: "Oct 21, 2025",
    status: "pending"
  },
  {
    id: "REQ-0003",
    facultyName: "Prof. Maria Santos",
    department: "Civil Engineering",
    fileName: "FacultyHandbook.pdf",
    dateRequested: "Oct 20, 2025",
    status: "pending"
  },
  {
    id: "REQ-0004",
    facultyName: "Prof. Carlo Reyes",
    department: "Mechanical Engineering",
    fileName: "ResearchGrantList.pdf",
    dateRequested: "Oct 19, 2025",
    status: "declined"
  },

   {
    id: "REQ-0004",
    facultyName: "Prof. Carlo Reyes",
    department: "Mechanical Engineering",
    fileName: "ResearchGrantList.pdf",
    dateRequested: "Oct 19, 2025",
    status: "declined"
  }

];

export const activityLog = [
  {
    id: 1,
    name: "Prof. Ben Cruz",
    action: "borrowed",
    fileName: "DeptReport_Q3.pdf",
    dueDate: "Oct 22, 2025, 12:30 PM",
    avatar: "https://c.animaapp.com/27o9iVJi/img/profile-02.svg"
  },
  {
    id: 2,
    name: "Prof. Ado Dela Peña",
    action: "requested",
    fileName: "ThesisGuidelines2025.pdf",
    dueDate: "Oct 22, 2025, 12:30 PM",
    avatar: "https://c.animaapp.com/27o9iVJi/img/profile-03.svg"
  },
  {
    id: 3,
    name: "Prof. Maria Santos",
    action: "borrowed",
    fileName: "FacultyHandbook.pdf",
    dueDate: "Oct 22, 2025, 12:30 PM",
    avatar: "https://c.animaapp.com/27o9iVJi/img/profile-04.svg"
  },
  {
    id: 5,
    name: "Prof. Carlo Reyes",
    action: "returned",
    fileName: "ResearchGrantList.pdf",
    dueDate: "Oct 22, 2025, 12:30 PM",
    avatar: "https://c.animaapp.com/27o9iVJi/img/profile-05.svg"
  }
];

export const notifications = [
  {
    id: 1,
    message: "New file request from Prof. Ben Cruz",
    time: "5 minutes ago",
    read: false
  },
  {
    id: 2,
    message: "File returned: ThesisGuidelines2025.pdf",
    time: "1 hour ago",
    read: false
  },
  {
    id: 3,
    message: "Overdue file alert: ResearchGrantList.pdf",
    time: "2 hours ago",
    read: true
  }
];

export const pendingUsers = [
  {
    id: "USR-001",
    name: "John Doe",
    dateOfBirth: "1990-05-15",
    role: "Faculty",
    department: "Computer Engineering",
  },
  {
    id: "USR-002",
    name: "Jane Smith",
    dateOfBirth: "1988-11-20",
    role: "Faculty",
    department: "Electrical Engineering",
  },
  {
    id: "USR-003",
    name: "Peter Jones",
    dateOfBirth: "1992-02-28",
    role: "Staff",
    department: "Civil Engineering",
  },
];