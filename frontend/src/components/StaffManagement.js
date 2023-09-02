import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import api from './api';

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
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

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openAddForm = () => {
    setIsFormVisible(true);
    setIsEditing(false);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
    });
  };

  const viewData = (index) => {
    setCurrentStaff(staffMembers[index]);
    toggleModal();
    toast.info('Viewing staff member details');
  };

  const editData = (index) => {
    const staffToEdit = staffMembers[index];
    setFormData({
      id: staffToEdit._id,
      name: staffToEdit.name,
      email: staffToEdit.email,
      phoneNumber: staffToEdit.phoneNumber,
      address: staffToEdit.address,
    });
    setIsFormVisible(true);
    setIsEditing(true);
    toggleModal();
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
        const response = await api.put(`/staff/${updatedStaffMember.id}`, updatedStaffMember);
        setStaffMembers(prevStaffMembers =>
          prevStaffMembers.map(staff =>
            staff.id === updatedStaffMember.id ? response.data.data : staff
          )
        );
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          address: '',
        });
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
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          address: '',
        });
        setIsFormVisible(false);
        toast.success('Staff member added successfully!');
      } catch (error) {
        console.error('Error adding staff:', error);
        toast.error('Failed to add staff member. Please try again.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <nav>
        {/* Navigation Links */}
      </nav>
      <h1 className="text-center mb-4">Staff Management</h1>
      <button className="btn btn-primary mb-4" onClick={openAddForm}>Add Data</button>
      <div className="table-responsive">
        {/* Staff Table */}
      </div>
      <Link to="/" className="btn btn-secondary mb-4 float-end">Back to Home</Link>

      {isFormVisible && (
        <div className="container mt-5">
          {/* Add/Edit Data Form */}
        </div>
      )}

      {isModalVisible && currentStaff && (
        <div className="modal" tabIndex="-1" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Staff Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> {currentStaff.id}</p>
                {/* Staff Details */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                >
                  Close
                </button>
                {!isEditing && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setIsFormVisible(true);
                      setIsEditing(true);
                      toggleModal();
                      setFormData({
                        id: currentStaff._id,
                        name: currentStaff.name,
                        email: currentStaff.email,
                        phoneNumber: currentStaff.phoneNumber,
                        address: currentStaff.address,
                      });
                    }}
                  >
                    Edit
                  </button>
                )}
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
