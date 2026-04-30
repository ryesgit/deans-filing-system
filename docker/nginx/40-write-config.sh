#!/bin/sh
set -eu

cat <<EOF >/usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL:-http://localhost:3001}",
  VITE_EMAILJS_SERVICE_ID: "${VITE_EMAILJS_SERVICE_ID:-}",
  VITE_EMAILJS_TEMPLATE_ID: "${VITE_EMAILJS_TEMPLATE_ID:-}",
  VITE_EMAILJS_PUBLIC_KEY: "${VITE_EMAILJS_PUBLIC_KEY:-}"
};
EOF
