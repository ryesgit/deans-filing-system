/**
 * Sanitizes input strings by escaping HTML special characters to prevent XSS attacks.
 * @param {string} str - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  const reg = /[&<>"'/]/ig;
  return str.replace(reg, (match) => map[match]);
};

/**
 * Sanitizes an entire object of inputs.
 * @param {Object} data - The object containing data to sanitize.
 * @returns {Object} - A new object with sanitized values.
 */
export const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const sanitized = Array.isArray(data) ? [] : {};
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};
