import emailjs from "@emailjs/browser";

// EmailJS configuration — set these in your .env file
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

/**
 * Returns true when all three EmailJS env variables are present.
 */
export const isEmailConfigured = () =>
  Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

/**
 * Low-level helper – sends an email through EmailJS.
 * Throws if EmailJS is not configured.
 */
const sendEmail = async ({ toEmail, toName, message }) => {
  if (!isEmailConfigured()) {
    console.warn(
      "EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env"
    );
    return false;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_name: toName,
        to_email: toEmail,
        message,
        reply_to: "noreply@pupfilingsystem.com",
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log(`Email sent successfully to ${toEmail}`);
    return true;
  } catch (err) {
    console.error("Failed to send email:", err);
    return false;
  }
};

/**
 * Sends a registration-received confirmation email to the newly registered user.
 */
export const sendRegistrationConfirmationEmail = ({ toEmail, toName }) =>
  sendEmail({
    toEmail,
    toName,
    message:
      "Thank you for registering with the Dean's Filing System! Your account has been submitted and is currently pending approval by an administrator. You will receive another email once your account has been approved. Please wait for the confirmation before attempting to log in.",
  });

/**
 * Sends an account-approval confirmation email to the user.
 */
export const sendApprovalEmail = ({ toEmail, toName, pupId }) =>
  sendEmail({
    toEmail,
    toName,
    message:
      `Congratulations! Your account registration has been approved by the administrator. You can now log in to the Dean's Filing System.\n\nHere are your login credentials:\n\nUsername (PUP ID): ${pupId || toEmail}\nDefault Password: password123\n\nIMPORTANT: For your security, please change your password immediately after logging in. You can update your password by going to Settings > Change Password.\n\nIf you have any issues logging in, please contact the administrator.`,
  });

/**
 * Sends a return date reminder email to the user.
 * @param {object} params
 * @param {string} params.toEmail - Recipient email address
 * @param {string} params.toName - Recipient name
 * @param {string} params.fileName - Name of the borrowed file
 * @param {string} params.returnDate - Return date string (e.g., "April 30, 2026")
 * @param {number} params.daysLeft - Number of days remaining before return date
 */
export const sendReturnDateReminderEmail = ({ toEmail, toName, fileName, returnDate, daysLeft }) =>
  sendEmail({
    toEmail,
    toName,
    message:
      `This is a friendly reminder that your borrowed file is due for return ${daysLeft === 0 ? 'TODAY' : `in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}.\n\nFile: ${fileName}\nReturn Date: ${returnDate}\n\nPlease return the file to the Dean's Office ${daysLeft === 0 ? 'today' : 'before the due date'} to avoid any issues.\n\nIf you have already returned the file, please disregard this message.\n\nThank you,\nDean's Filing System`,
  });
