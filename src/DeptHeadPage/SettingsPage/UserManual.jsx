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
        How to Manage File Requests
      </summary>
      <div className="collapsible-content">
        <p>
          Administrators oversee the lifecycle of file borrowing and access
          requests.
        </p>
        <ul>
          <li>
            <strong>Review Pending Requests:</strong> On the{" "}
            <strong>Dashboard</strong>, the <strong>Recent Requests</strong>{" "}
            table displays all active requests.
          </li>
          <li>
            <strong>Approve or Decline:</strong> Review the purpose and copy
            type. Click <strong>Approve</strong> to grant access or{" "}
            <strong>Decline</strong> if the request is invalid. When declining,
            you will be asked to provide a reason for the user's notification.
          </li>
          <li>
            <strong>Process Borrowing:</strong> For <strong>Original Copy</strong>{" "}
            requests, use the user's <strong>QR Code</strong> to verify their
            identity during pickup and return. This ensures real-time tracking
            of physical documents.
          </li>
        </ul>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        How to Manage Document Validity and Archives
      </summary>
      <div className="collapsible-content">
        <p>
          Maintaining the repository involves tracking document validity and
          properly archiving old records.
        </p>
        <ul>
          <li>
            <strong>Validity Tracking:</strong> In the{" "}
            <strong>Reports & Logs</strong> page, the{" "}
            <strong>Validity Due</strong> tab highlights files that are expiring
            soon or have already expired.
          </li>
          <li>
            <strong>Archive Records:</strong> When a document is no longer
            valid, click <strong>Archive</strong>. This hides the file from the
            general system and moves it to the <strong>Archives</strong> tab.
            Always remember to remove the physical copy from the cabinet as
            prompted.
          </li>
          <li>
            <strong>Export Reports:</strong> Generate CSV reports for validity
            data or archived records to maintain official audit trails.
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
          profile and security.
        </p>
        <ul>
          <li>
            <strong>Update Profile Picture:</strong> Click on your avatar to
            upload a new image.
          </li>
          <li>
            <strong>Reset Password:</strong> Use the "Reset Password" button to
            update your security credentials.
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
        How to Manage File Requests
      </summary>
      <div className="collapsible-content">
        <p>
          Staff members play a key role in processing document access and
          borrowing requests.
        </p>
        <ul>
          <li>
            <strong>Dashboard Requests:</strong> Navigate to the{" "}
            <strong>Dashboard</strong> to see the{" "}
            <strong>Recent Requests</strong> list.
          </li>
          <li>
            <strong>Take Action:</strong> Review the details of each request.
            Click <strong>Approve</strong> to authorize the request or{" "}
            <strong>Decline</strong> if necessary, providing a clear reason for
            the user.
          </li>
          <li>
            <strong>QR Code Scanning:</strong> When a user arrives to borrow or
            return a physical document, scan their personal{" "}
            <strong>QR Code</strong> to accurately update the system's borrowing
            logs.
          </li>
        </ul>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">
        Document Validity and Archives
      </summary>
      <div className="collapsible-content">
        <p>
          Assist in maintaining the integrity of the digital repository by
          monitoring file validity.
        </p>
        <ul>
          <li>
            <strong>Validity Checks:</strong> Use the{" "}
            <strong>Reports & Logs</strong> page to view the{" "}
            <strong>Validity Due</strong> tab. Monitor for "Expired" or "Due
            Soon" statuses.
          </li>
          <li>
            <strong>Archiving:</strong> Help keep the file list clean by
            archiving expired documents. Ensure that physical documents are
            accounted for when archived.
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
          The <strong>Settings</strong> page is where you can manage your
          personal profile and account security.
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
            <strong>Locate Your Document:</strong> Use the{" "}
            <strong>"Search for a file..."</strong> input to find the specific
            document you need.
          </li>
          <li>
            <strong>Complete the Form:</strong> Briefly state the{" "}
            <strong>Purpose</strong> of your request. The department and
            category fields will automatically populate once a file is selected.
          </li>
          <li>
            <strong>Select Copy Type:</strong>
            <ul>
              <li>
                <strong>Soft Copy (Digital PDF):</strong> Choose this for
                instant digital access upon approval.
              </li>
              <li>
                <strong>Original Copy (Physical Document):</strong> Select this
                to borrow the physical file. You must also specify a{" "}
                <strong>Planned Return Date</strong> and a{" "}
                <strong>Priority Level</strong>.
              </li>
            </ul>
          </li>
          <li>
            <strong>Submit and Track:</strong> Click <strong>Submit</strong>.
            You can monitor the progress of your request (Pending, Approved, or
            Declined) in the <strong>Request Status</strong> table below.
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
          Your personal QR code, located on the{" "}
          <strong>Request a File</strong> page, serves as your unique digital
          identifier for physical items. When you pick up or return an{" "}
          <strong>Original Copy</strong>, an Administrator or Staff member will
          scan this code to verify your identity and update the system records
          instantly, ensuring all transactions are accurately tracked.
        </p>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">How to View Your History</summary>
      <div className="collapsible-content">
        <p>
          The <strong>Reports & Logs</strong> page contains a complete history
          of your personal activity.
        </p>
        <ul>
          <li>
            <strong>Track Transactions:</strong> View all your requests,
            including their current status and history.
          </li>
          <li>
            <strong>Filter by Type:</strong> Easily sort through your borrowed
            items, returned files, and general requests.
          </li>
          <li>
            <strong>Export Data:</strong> Use the <strong>Export</strong> button
            to download your activity log as a CSV file for personal record-keeping.
          </li>
        </ul>
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
          The process is designed to be straightforward:
        </p>
        <ol>
          <li>
            <strong>Locate the File:</strong> Use the{" "}
            <strong>"Search for a file..."</strong> bar to find the specific
            document you need.
          </li>
          <li>
            <strong>Provide a Purpose:</strong> Clearly state the{" "}
            <strong>Purpose</strong> of your request in the provided field.
          </li>
          <li>
            <strong>Choose Your Copy Type:</strong>
            <ul>
              <li>
                <strong>Soft Copy (Digital PDF):</strong> Select this for
                instant digital access. Once approved, you can view the PDF
                directly from the <strong>Request Status</strong> table.
              </li>
              <li>
                <strong>Original Copy (Physical Document):</strong> Select this
                to borrow the physical item. You must set a planned{" "}
                <strong>Return Date</strong> and <strong>Priority Level</strong>.
              </li>
            </ul>
          </li>
          <li>
            <strong>Submit and Monitor:</strong> Click <strong>Submit</strong>{" "}
            and track the <strong>Request Status</strong> table for real-time
            updates on your request.
          </li>
        </ol>
        <div className="manual-callout callout-important">
          <div className="callout-title">
            <strong>Important</strong>
          </div>
          <p>
            You may only borrow <strong>one Original Copy</strong> at a time.
            Please return your current item before requesting a new physical
            document.
          </p>
        </div>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">Your Personal QR Code</summary>
      <div className="collapsible-content">
        <p>
          Your personal QR code, found on the <strong>Request a File</strong>{" "}
          page, is your unique digital identifier for borrowing physical
          documents. An Administrator will scan this code during pickup and
          return to verify your account and ensure your borrowing history is
          accurately updated.
        </p>
      </div>
    </details>

    <details className="collapsible-section">
      <summary className="collapsible-title">Viewing Your History</summary>
      <div className="collapsible-content">
        <p>
          Go to the <strong>Reports & Logs</strong> page to see a full history
          of your file requests, borrowed items, and returns.
        </p>
        <ul>
          <li>
            <strong>Monitor Requests:</strong> See if your requests are pending,
            approved, or declined.
          </li>
          <li>
            <strong>Borrowing History:</strong> Keep track of what you've
            borrowed and when you've returned them.
          </li>
          <li>
            <strong>Export to CSV:</strong> Download your logs anytime for your
            academic records.
          </li>
        </ul>
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
