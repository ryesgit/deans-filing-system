import React from "react";
import "./UserManual.css";

const AdminManual = () => (
  <div className="manual-section">
    <h3 className="manual-section-title">
      Getting Started: Administrator Role
    </h3>
    <p>
      Welcome! As an <strong>Administrator</strong>, you have comprehensive
      control over the system. Your role is crucial for managing users,
      organizing the digital library, and overseeing file requests. This guide
      will walk you through your key responsibilities.
    </p>

    <details className="collapsible-section">
      <summary className="collapsible-title">How to Use the Dashboard</summary>
      <div className="collapsible-content">
        <p>
          The <strong>Dashboard</strong> is your command center, providing a
          real-time overview of all system activity. From here, you can:
        </p>
        <ul>
          <li>
            Monitor key statistics: Total files, active borrowing, pending
            user/file approvals, and overdue items.
          </li>
          <li>
            View the <strong>Activity Log</strong> for a detailed feed of recent
            actions performed by all users.
          </li>
          <li>
            Use <strong>Quick Actions</strong> for one-click access to essential
            tasks like adding a file or a new user.
          </li>
        </ul>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage User Accounts
      </summary>
      <div className="collapsible-content">
        <p>
          The <strong>User Management</strong> page is where you handle all
          aspects of user accounts.
        </p>
        <ul>
          <li>
            <strong>Approve New Users:</strong> Navigate to the{" "}
            <strong>Pending Users</strong> section. Here, you can review
            registration requests and either <strong>Approve</strong> to grant
            access or <strong>Decline</strong> if the user is not authorized.
          </li>
          <li>
            <strong>Add a User:</strong> Click the <strong>+ Add User</strong>{" "}
            button to open a form and manually create a new user account.
          </li>
          <li>
            <strong>Edit or Delete a User:</strong> Simply click on any user's
            card or list item to open the details view. From there, you can
            select <strong>Edit User</strong> to modify their information or{" "}
            <strong>Delete User</strong> to permanently remove their account.
          </li>
          <li>
            <strong>Find Specific Users:</strong> Use the global search bar at
            the top or click the <strong>Filter</strong> button to narrow down
            the user list by role, department, or status.
          </li>
        </ul>
        <div className="manual-callout callout-note">
          <div className="callout-title">
            <strong>Note</strong>
          </div>
          <p>
            When declining a user, you will be prompted to provide a reason.
            This helps maintain clear communication and record-keeping.
          </p>
        </div>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Files and Folders
      </summary>
      <div className="collapsible-content">
        <p>
          On the <strong>File Management</strong> page, you are responsible for
          maintaining the entire digital document repository.
        </p>
        <ul>
          <li>
            <strong>Organize with Folders:</strong> Folders act as categories
            for your documents. Use the <strong>Add Folder</strong> button to
            create new ones. To edit or delete a folder, click the three-dot
            menu on the folder card.
          </li>
          <li>
            <strong>Upload New Files:</strong> First, click on a folder to open
            it. Then, use the <strong>Add File</strong> button to upload a new
            PDF document and fill in its details.
          </li>
          <li>
            <strong>Manage Individual Files:</strong> Within an open folder, you
            can <strong>View</strong> a PDF, <strong>Edit</strong> its metadata,
            or <strong>Delete</strong> it from the system using the action
            buttons in the file list.
          </li>
        </ul>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Your Account
      </summary>
      <div className="collapsible-content">
        <p>
          The <strong>Settings</strong> page allows you to manage your personal
          profile.
        </p>
        <ul>
          <li>
            <strong>Update Profile Picture:</strong> Click on your avatar to
            upload a new image.
          </li>
          <li>
            <strong>Reset Password:</strong> Use the "Reset Password" button to
            change your account password for security.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

const StaffManual = () => (
  <div className="manual-section">
    <h3 className="manual-section-title">Getting Started: Staff Role</h3>
    <p>
      Welcome! As a <strong>Staff</strong> member, your primary role is to
      manage the system's document library and assist in the file request
      process. This guide outlines your key functionalities.
    </p>

    <details className="collapsible-section">
      <summary className="collapsible-title">How to Use the Dashboard</summary>
      <div className="collapsible-content">
        <p>
          The <strong>Dashboard</strong> provides an overview of system
          activity. You can:
        </p>
        <ul>
          <li>
            Monitor statistics related to files, borrowing, and pending
            approvals.
          </li>
          <li>
            View the <strong>Activity Log</strong> to see recent user actions.
          </li>
          <li>
            Use <strong>Quick Actions</strong> to navigate to the{" "}
            <strong>File Management</strong> page.
          </li>
        </ul>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Files and Folders
      </summary>
      <div className="collapsible-content">
        <p>
          Your main responsibility is on the <strong>File Management</strong>{" "}
          page, where you maintain the digital document repository.
        </p>
        <ul>
          <li>
            <strong>Organize with Folders:</strong> Use the{" "}
            <strong>Add Folder</strong> button to create new categories. You can
            also edit or delete existing folders.
          </li>
          <li>
            <strong>Upload and Manage Files:</strong> Within a folder, you can
            use the <strong>Add File</strong> button to upload new PDFs. You
            also have the ability to <strong>View</strong>,{" "}
            <strong>Edit</strong>, and <strong>Delete</strong> any file in the
            system.
          </li>
        </ul>
        <div className="manual-callout callout-note">
          <div className="callout-title">
            <strong>Note</strong>
          </div>
          <p>
            User account management, including approvals and deletions, is
            handled by Administrators. Your role is focused on file management.
          </p>
        </div>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Your Account
      </summary>
      <div className="collapsible-content">
        <p>
          The <strong>Settings</strong> page is where you can manage your
          personal profile.
        </p>
        <ul>
          <li>
            <strong>Update Profile Picture:</strong> You can change your display
            picture by clicking on your avatar.
          </li>
          <li>
            <strong>Reset Password:</strong> For security, you can change your
            account password at any time.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

const FacultyManual = () => (
  <div className="manual-section">
    <h3 className="manual-section-title">Getting Started: Faculty Role</h3>
    <p>
      As a <strong>Faculty</strong> member, you have access to the document
      repository for your academic and research needs. This guide explains how
      to request files and track your activity.
    </p>

    <details className="collapsible-section">
      <summary className="collapsible-title">How to Request a File</summary>
      <div className="collapsible-content">
        <p>
          The <strong>Request a File</strong> page is your primary tool for
          accessing documents.
        </p>
        <ol>
          <li>
            <strong>Find Your Document:</strong> Use the{" "}
            <strong>Search for a file...</strong> input to locate the document
            you need.
          </li>
          <li>
            <strong>Complete the Form:</strong> Fill in the purpose of your
            request. The department and category fields will often auto-fill
            when you select a file.
          </li>
          <li>
            <strong>Select Copy Type:</strong> Choose between a{" "}
            <strong>Soft Copy</strong> (digital PDF) or an{" "}
            <strong>Original Copy</strong> (physical document). For original
            copies, you must also specify a return date and priority level.
          </li>
          <li>
            <strong>Submit and Track:</strong> Click the <strong>Submit</strong>{" "}
            button. You can monitor the progress of your request in the{" "}
            <strong>Request Status</strong> table on the same page.
          </li>
        </ol>
        <div className="manual-callout callout-tip">
          <div className="callout-title">
            <strong>Tip</strong>
          </div>
          <p>
            Once a <strong>Soft Copy</strong> request is approved, a{" "}
            <strong>View PDF</strong> button will appear in the status table,
            giving you instant access to the document.
          </p>
        </div>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        Understanding Your QR Code
      </summary>
      <div className="collapsible-content">
        <p>
          Your personal QR code, found on the <strong>Request a File</strong>{" "}
          page, is your digital key for physical items. An administrator will
          scan it to quickly and securely log when you borrow or return an{" "}
          <strong>Original Copy</strong>, ensuring all transactions are
          accurately tracked.
        </p>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">How to View Your Reports</summary>
      <div className="collapsible-content">
        <p>
          The <strong>Reports & Logs</strong> page contains a complete history
          of your activity. You can filter your transactions by type (Request,
          Borrowed, Returned) and export the data as a CSV file for your
          records.
        </p>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Your Settings
      </summary>
      <div className="collapsible-content">
        <p>
          The <strong>Settings</strong> page allows you to view your profile and
          manage your account.
        </p>
        <ul>
          <li>
            <strong>View Your Profile:</strong> See all your registered
            information, including your ID number, department, and join date.
          </li>
          <li>
            <strong>Update Profile Picture:</strong> Click your avatar to upload
            a new photo.
          </li>
          <li>
            <strong>Reset Password:</strong> Change your password regularly to
            keep your account secure.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

const StudentManual = () => (
  <div className="manual-section">
    <h3 className="manual-section-title">Getting Started: Student Role</h3>
    <p>
      Welcome! As a <strong>Student</strong>, this system allows you to request
      access to academic files and resources. This guide will show you how to
      make requests and manage your account.
    </p>

    <details className="collapsible-section">
      <summary className="collapsible-title">How to Request a File</summary>
      <div className="collapsible-content">
        <p>
          Navigate to the <strong>Request a File</strong> page to get started.
          The process is simple:
        </p>
        <ol>
          <li>
            <strong>Find the File:</strong> Use the{" "}
            <strong>Search for a file...</strong> bar to find the document you
            need.
          </li>
          <li>
            <strong>Fill Out the Form:</strong> Clearly state the{" "}
            <strong>Purpose</strong> of your request.
          </li>
          <li>
            <strong>Choose Your Copy Type:</strong>
            <ul>
              <li>
                Select <strong>Soft Copy</strong> for digital access. If
                approved, you can view the PDF directly from the status table.
              </li>
              <li>
                Select <strong>Original Copy</strong> to borrow the physical
                item. You must also set a planned <strong>Return Date</strong>.
              </li>
            </ul>
          </li>
          <li>
            <strong>Submit and Monitor:</strong> Click <strong>Submit</strong>{" "}
            and watch the <strong>Request Status</strong> table for updates on
            your request.
          </li>
        </ol>
        <div className="manual-callout callout-important">
          <div className="callout-title">
            <strong>Important</strong>
          </div>
          <p>
            You may only borrow <strong>one Original Copy</strong> at a time.
            Please return your current item before requesting a new one.
          </p>
        </div>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">Your Personal QR Code</summary>
      <div className="collapsible-content">
        <p>
          The QR code on the <strong>Request a File</strong> page is your unique
          ID for borrowing physical documents. An administrator will scan it
          during pickup and return to ensure your account is updated correctly.
        </p>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">Viewing Your History</summary>
      <div className="collapsible-content">
        <p>
          Go to the <strong>Reports & Logs</strong> page to see a full history
          of your file requests, borrowed items, and returns. You can also
          export this log to a CSV file.
        </p>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Your Settings
      </summary>
      <div className="collapsible-content">
        <p>
          The <strong>Settings</strong> page is your personal area for account
          management.
        </p>
        <ul>
          <li>
            <strong>View Your Profile:</strong> Review your personal and
            academic information.
          </li>
          <li>
            <strong>Update Profile Picture:</strong> Personalize your account by
            uploading a new profile picture.
          </li>
          <li>
            <strong>Reset Password:</strong> Secure your account by changing
            your password whenever needed.
          </li>
        </ul>
      </div>
    </details>
  </div>
);

export const UserManual = ({ role }) => {
  const renderManual = () => {
    const upperCaseRole = role?.toUpperCase();
    switch (upperCaseRole) {
      case "ADMIN":
        return <AdminManual />;
      case "STAFF":
        return <StaffManual />;
      case "FACULTY":
        return <FacultyManual />;
      case "STUDENT":
        return <StudentManual />;
      default:
        return <p>User manual is not available for your role.</p>;
    }
  };

  return (
    <section className="settings-card user-manual-card">
      <h2 className="settings-card-title">User Manual</h2>
      {renderManual()}
    </section>
  );
};
