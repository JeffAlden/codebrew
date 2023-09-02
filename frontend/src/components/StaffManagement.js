import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import api from './api';

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const [currentStaff, setCurrentStaff] = useState(null);
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.loggedIn) {
      toast.success('Logged in successfully!');
    }
    fetchStaffData();
  }, [location.state]);

  const fetchStaffData = () => {
    api.get('/staff')
      .then(response => setStaffMembers(response.data))
      .catch(error => console.error('Error fetching staff:', error));
  };

  const viewData = (index) => {
    setCurrentStaff(staffMembers[index]);
    setIsViewModalVisible(true);
    toast.info('Viewing staff member details');
  };

  const editData = (index) => {
    const staffToEdit = staffMembers[index];
    setFormData({
      _id: staffToEdit._id,
      name: staffToEdit.name,
      email: staffToEdit.email,
      phoneNumber: staffToEdit.phoneNumber,
      address: staffToEdit.address
    });
    setIsFormVisible(true);
    setIsEditing(true);
    setIsEditModalVisible(true);
    setIsViewModalVisible(false);
    toast.info('Editing staff member. Update the form and save!');
  };

  const deleteData = (index) => {
    const staffToDelete = staffMembers[index];
    api.delete(`/staff/${staffToDelete._id}`)
      .then(() => {
        const updatedStaffMembers = staffMembers.filter((_, i) => i !== index);
        setStaffMembers(updatedStaffMembers);
        toast.error('Staff member deleted successfully!');
      })
      .catch(() => {
        toast.error("Error deleting staff member!");
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isEditing) {
      try {
        const updatedStaffMember = { ...formData };
        const response = await api.put(`/staff/${updatedStaffMember._id}`, updatedStaffMember);
        setStaffMembers(prevStaffMembers =>
          prevStaffMembers.map(staff =>
            staff._id === updatedStaffMember._id ? response.data.data : staff
          )
        );
        clearFormData();
        setIsFormVisible(false);
        setIsEditing(false);
        toast.success('Staff member updated successfully!');
      } catch (error) {
        console.error('Error updating staff:', error);
        toast.error('Failed to update staff member. Please try again.');
      }
    } else {
      try {
        const newStaffMember = { ...formData };
        const response = await api.post('/staff', newStaffMember);
        setStaffMembers(prevStaffMembers => [...prevStaffMembers, response.data.data]);
        clearFormData();
        setIsFormVisible(false);
        toast.success('Staff member added successfully!');
      } catch (error) {
        console.error('Error adding staff:', error);
        toast.error('Failed to add staff member. Please try again.');
      }
    }
  };

  const clearFormData = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    });
  };

  return (
    <div className="container mt-5">
      {/* Navigation */}
      <nav>
        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <Link className="nav-link active" to="/staff-management">Staff Management</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/signup-admin">Sign Up Admin</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/contact-us-admin">Contact Us Admin</Link>
          </li>
        </ul>
      </nav>
      {/* Title */}
      <h1 className="text-center mb-4">Staff Management</h1>
      {/* Add Data Button */}
      <button className="btn btn-primary mb-4" onClick={() => { setIsFormVisible(true); setIsEditing(false); clearFormData(); }}>Add Data</button>
      {/* Staff Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Name</th>
              <th className="text-center">Email</th>
              <th className="text-center">Phone Number</th>
              <th className="text-center">Address</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map((staff, index) => (
              <tr key={staff._id}>
                <td className="text-center">{staff._id}</td>
                <td className="text-center">{staff.name}</td>
                <td className="text-center">{staff.email}</td>
                <td className="text-center">{staff.phoneNumber}</td>
                <td className="text-center">{staff.address}</td>
                <td className="text-center">
                  <button style={{ backgroundColor: '#0DCAF0', borderColor: '#0DCAF0', color: '#000000' }} className="btn mr-2" onClick={() => viewData(index)}>View</button>
                  <button style={{ backgroundColor: '#FFC107', borderColor: '#FFC107', color: '#000000' }} className="btn mr-2" onClick={() => editData(index)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => deleteData(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add/Edit Data Form */}
      {isFormVisible && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h5>
                <button type="button" className="close" onClick={() => { setIsFormVisible(false); clearFormData(); }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input type="text" className="form-control" id="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">{isEditing ? 'Update' : 'Add'}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setIsFormVisible(false); setIsEditing(false); clearFormData(); }}>Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Staff Modal */}
      {isViewModalVisible && currentStaff && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Staff Member</h5>
                <button type="button" className="close" onClick={() => setIsViewModalVisible(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Name:</strong> {currentStaff.name}</p>
                <p><strong>Email:</strong> {currentStaff.email}</p>
                <p><strong>Phone Number:</strong> {currentStaff.phoneNumber}</p>
                <p><strong>Address:</strong> {currentStaff.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default StaffManagement;
