// Test script to register a user
const fetch = require('node-fetch'); // You might need to install this

async function registerUser() {
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "Staff",
    phone: "+1234567890",
    city: "New York", 
    country: "USA"
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log('Registration Response:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

registerUser();