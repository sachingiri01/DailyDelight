import axios from 'axios';

// Define the base URL for your API
const baseURL = 'http://127.0.0.1:8000/';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: baseURL,
  // You can also set default headers here if needed
  headers: {
    'Content-Type': 'application/json',
    Accept :'application/json'
    // 'Authorization': 'Bearer your-token', // Example of adding a token
  }
});

export default api;