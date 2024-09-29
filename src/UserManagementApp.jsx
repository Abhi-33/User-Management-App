import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaUserPlus, FaSpinner } from "react-icons/fa";
import './UserManagementApp.css'; 
import Loader from "./Loader";

const UserManagementApp = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

//   function fetching the userlist from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
      setLoading(false);
    }
  };
 
//  function to create a new user in the list
  const createUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users", newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "", phone: "" });
    } catch (err) {
      setError("Failed to create user. Please try again.");
    }
  };

  // function to update the existing users or newly added users in the list
  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${editingUser.id}`, editingUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? response.data : user)));
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user. Please try again.");
    }
  };

//   function to delete a user from the list
  const deleteUser = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user. Please try again.");
    }
  };

//   if data-fetching or any request ongoing loading will be shown or on refreshing page
  if (loading) {
    return (
       <Loader />
    );
  }

  return (
    // main container for the full page
    <div className="container">
        {/* Title Heading*/}
      <h1 className="title">User Management Application</h1>

      {error && (
        <div className="error-alert" role="alert">
          <span>{error}</span>
        </div>
      )}

        {/* First form to create a new user */}
      <form onSubmit={createUser} className="form">
        <h2 className="form-title">Create New User</h2>
        <div className="form-group">
            {/* Name Input */}
          <label htmlFor="name" className="form-label">Name</label>
          <input
            className="form-input"
            id="name"
            type="text"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
        </div>
      {/* Email input */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            className="form-input"
            id="email"
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        {/* Phone input */}
        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            className="form-input"
            id="phone"
            type="tel"
            placeholder="Enter phone number"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            required
          />
        </div>
        {/* Submitting the form */}
        <div className="form-actions">
          <button
            className="btn-create"
            type="submit"
          >
            <FaUserPlus className="icon" /> Create User</button>
        </div>
      </form>

            {/* User lists Table (Users fetched from JSONPlaceholder API) */}
      <div className="user-list">
        <h2 className="user-list-title">User List</h2>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
                {/* showing users with credentials */}
              {users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-data">{user.name}</td>
                  <td className="table-data">{user.email}</td>
                  <td className="table-data">{user.phone}</td>
                  <td className="table-data">
                    {/* Editing Button to edit the details of a existing user */}
                    <button
                      onClick={() => setEditingUser(user)}
                      className="btn-edit"
                      aria-label="Edit user"
                    >
                      <FaEdit className="editIcon"/>
                    </button>
                    {/* Delete button to delete a user from list */}
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="btn-delete"
                      aria-label="Delete user"
                    >
                      <FaTrash className="deleteIcon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
                {/* If user is editing then this modal will be shown */}
      {editingUser && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit User</h3>
              <form onSubmit={updateUser} className="modal-form">
                <div className="form-group">
                    {/* Name Input */}
                  <label htmlFor="edit-name" className="form-label">Name</label>
                  <input
                    className="form-input"
                    id="edit-name"
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    required
                  />
                </div>
                {/* Email Input */}
                <div className="form-group">
                  <label htmlFor="edit-email" className="form-label">Email</label>
                  <input
                    className="form-input"
                    id="edit-email"
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    required
                  />
                </div>
                {/* Phone Input */}
                <div className="form-group">
                  <label htmlFor="edit-phone" className="form-label">Phone</label>
                  <input
                    className="form-input"
                    id="edit-phone"
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    required
                  />
                </div>
                {/* Editing Form submission */}
                <div className="modal-actions">
                  <button
                    className="btn-update"
                    type="submit"
                  >
                    Update User
                  </button>
                </div>
              </form>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setEditingUser(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementApp;
