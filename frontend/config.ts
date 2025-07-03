// This file contains configuration variables for the application.

// The base URL for the backend API.
// During development, this is typically localhost.
// For testing on a physical device, this needs to be your machine's local IP address.
// In production, this would be the URL of your deployed backend server.
const API_BASE_URL = 'http://127.0.0.1:8000';

export const config = {
  apiBaseUrl: API_BASE_URL,
};
