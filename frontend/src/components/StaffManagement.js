import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import api from './api';


const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [modalTitle, setModalTitle] = useState('');

  const location = useLocation();

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

  const openModal = (title, index = null) => {
    setModalTitle(title);
    if (index !== null) {
      const staff = staffMembers[index];
      setFormData({
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        address: staff.address
      });
    } else {
      setFormData({
        id: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: ''
      });
    }
    setIsModalVisible(true);
  };

  const deleteData = (index) => {
    const staffToDelete = staffMembers[index];
    api.delete(`/staff/${staffToDelete._id}`)
      .then(() => {
        const updatedStaffMembers = staffMembers.filter((_, i) => i !== index);
        setStaffMembers(updatedStaffMembers);
        toast.success('Staff member deleted successfully!');
      })
      .catch(() => {
        toast.error('Error deleting staff member.');
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.id) {
      try {
        const response = await api.put(`/staff/${formData.id}`, formData);
        setStaffMembers(prevStaffMembers => 
          prevStaffMembers.map(staff => 
            staff._id === formData.id ? response.data : staff
          )
        );
        toast.success('Staff member updated successfully!');
      } catch (error) {
        toast.error('Failed to update staff member.');
      }
    } else {
      try {
        const response = await api.post('/staff', formData);
        setStaffMembers([...staffMembers, response.data]);
        toast.success('Staff member added successfully!');
      } catch (error) {
        toast.error('Failed to add staff member.');
      }
    }
    setIsModalVisible(false);
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
      <button className="btn btn-primary mb-4" onClick={() => openModal('Add Data')}>Add Data</button>

      {/* Staff Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffMembers.map((staff, index) => (
            <tr key={staff._id}>
              <td>{staff._id}</td>
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.phoneNumber}</td>
              <td>{staff.address}</td>
              <td>
                <button className="btn btn-info" onClick={() => openModal('View Data', index)}>View</button>
                <button className="btn btn-warning" onClick={() => openModal('Edit Data', index)}>Edit</button>
                <button className="btn btn-danger" onClick={() => deleteData(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back to Home Button */}
      <Link to="/" className="btn btn-secondary mb-4 float-end">Back to Home</Link>

      {/* Add/Edit/View Data Modal */}
      {isModalVisible && (
        <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalVisible(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {['name', 'email', 'phoneNumber', 'address'].map((field, idx) => (
                    <div key={idx} className="form-group">
                      <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        className="form-control"
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                        required
                      />
                    </div>
                  ))}
                  <button type="submit" className="btn btn-success">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsModalVisible(false)}>Cancel</button>
                </form>
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
