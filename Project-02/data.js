// src/data.js
// Simple in-memory "database". The project deck says:
// "Before you scale into complex databases..." -> so we keep data in memory.
// In a real app this would be PostgreSQL/MongoDB (your Raftar stack).

let users = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", role: "admin" },
  { id: 2, name: "Sara Ahmed", email: "sara@example.com", role: "user" },
];

// keeps track of the next id to assign
let nextId = 3;

function getAllUsers() {
  return users;
}

function getUserById(id) {
  return users.find((u) => u.id === id);
}

function addUser({ name, email, role }) {
  const newUser = { id: nextId++, name, email, role: role || "user" };
  users.push(newUser);
  return newUser;
}

module.exports = { getAllUsers, getUserById, addUser };
