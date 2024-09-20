import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../../layouts";
import BreadCrumb from "../../layouts/BreadCrumb";
import api from "../../../services/api";
import url from "../../../services/url";
import { getAccessToken } from '../../../utils/auth';

function TripList() {
    const [trips, setTrips] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingTrip, setEditingTrip] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const [newTrip, setNewTrip] = useState({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        groupSize: "",
        categoriesId: [],
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    const [formErrors, setFormErrors] = useState({
        tripName: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        groupSize: "",
        categoriesId: [],
    });

    const validateForm = (trip) => {
        let valid = true;
        const newErrors = {};
        if (!trip.tripName) {
            newErrors.tripName = "Please enter a trip name.";
            valid = false;
        }
        if (!trip.destination) {
            newErrors.destination = "Please enter a destination.";
            valid = false;
        }
        if (!trip.startDate || !trip.endDate) {
            newErrors.dates = "Please provide both start and end dates.";
            valid = false;
        }
        if (!trip.budget || isNaN(trip.budget)) {
            newErrors.budget = "Please enter a valid budget.";
            valid = false;
        }
        if (!trip.groupSize || isNaN(trip.groupSize)) {
            newErrors.groupSize = "Please enter a valid group size.";
            valid = false;
        }
        setFormErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingTrip) {
            setEditingTrip({ ...editingTrip, [name]: value });
        } else {
            setNewTrip({ ...newTrip, [name]: value });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };


    const fetchTrips = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${getAccessToken()}`,
            };
            const response = await api.get(url.DESTINATION.LIST, { headers });
            setTrips(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch trips");
        }
    };

    const fetchCategories = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${getAccessToken()}`,
            };
            const response = await api.get(url.CATEGORY.LIST, { headers });
            setCategories(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        fetchTrips();
        fetchCategories(); // Fetch categories on component mount
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tripToSave = editingTrip ? { ...editingTrip } : { ...newTrip };

        // Validate form
        if (validateForm(tripToSave)) {
            try {
                const headers = {
                    Authorization: `Bearer ${getAccessToken()}`,
                };

                let response;
                if (editingTrip) {
                    // Gửi id trong payload mà không cần trong URL
                    response = await api.put(`${url.DESTINATION.EDIT}`, tripToSave, { headers });
                    setEditingTrip(null); // Reset trạng thái sau khi cập nhật
                } else {
                    response = await api.post(url.DESTINATION.CREATE, tripToSave, { headers });
                    // Reset form thêm mới sau khi thêm thành công
                    setNewTrip({
                        tripName: "",
                        destination: "",
                        startDate: "",
                        endDate: "",
                        budget: "",
                        groupSize: "",
                        categoriesId: [],
                    });
                }

                if (response && response.data) {
                    toast.success("Trip saved successfully!");
                    fetchTrips(); // Refresh danh sách
                    setIsAdding(false); // Đóng form thêm
                }
            } catch (error) {
                toast.error("Failed to save trip.");
            }
        }
    };

    const handleEdit = (trip) => {
        // Accessing the category ID here
        console.log('Editing category with ID:', trip.id);
        setEditingTrip({ ...trip });
    };

    const handleDelete = async (id) => {
        try {
            const headers = {
                Authorization: `Bearer ${getAccessToken()}`,
            };
            await api.delete(`${url.DESTINATION.DELETE}`, { headers, data: [id] });
            toast.success("Trip deleted successfully!");
            fetchTrips();  // Refresh the list after deletion
        } catch (error) {
            toast.error("Failed to delete trip.");
        }
    };

    const handleCancel = () => {
        setEditingTrip(null);
        setIsAdding(false);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const paginatedTrips = trips.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil(trips.length / rowsPerPage);

    return (
        <Layout>
            <ToastContainer />
            <div className="container mt-5">
                <h1 className="mb-4">Trip List</h1>
                <BreadCrumb title="Trip List" />

                <button
                    className="btn btn-success mb-4"
                    onClick={() => setIsAdding(true)}
                >
                    <FaPlus /> Add Trip
                </button>

                {isAdding && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5>Add New Trip</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4 mt-3">
                                        <input
                                            type="text"
                                            name="tripName"
                                            className={`form-control ${formErrors.tripName ? "is-invalid" : ""}`}
                                            placeholder="Trip Name"
                                            value={newTrip.tripName}
                                            onChange={handleChange}
                                            autoFocus
                                        />
                                        {formErrors.tripName && <div className="invalid-feedback">{formErrors.tripName}</div>}
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <input
                                            type="text"
                                            name="destination"
                                            className={`form-control ${formErrors.destination ? "is-invalid" : ""}`}
                                            placeholder="Destination"
                                            value={newTrip.destination}
                                            onChange={handleChange}
                                        />
                                        {formErrors.destination && <div className="invalid-feedback">{formErrors.destination}</div>}
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <input
                                            type="date"
                                            name="startDate"
                                            className={`form-control ${formErrors.startDate ? "is-invalid" : ""}`}
                                            value={newTrip.startDate}
                                            onChange={handleChange}
                                        />
                                        {formErrors.startDate && <div className="invalid-feedback">{formErrors.startDate}</div>}
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <input
                                            type="date"
                                            name="endDate"
                                            className={`form-control ${formErrors.endDate ? "is-invalid" : ""}`}
                                            value={newTrip.endDate}
                                            onChange={handleChange}
                                        />
                                        {formErrors.endDate && <div className="invalid-feedback">{formErrors.endDate}</div>}
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <input
                                            type="number"
                                            name="budget"
                                            className={`form-control ${formErrors.budget ? "is-invalid" : ""}`}
                                            placeholder="Budget"
                                            value={newTrip.budget}
                                            onChange={handleChange}
                                        />
                                        {formErrors.budget && <div className="invalid-feedback">{formErrors.budget}</div>}
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <input
                                            type="number"
                                            name="groupSize"
                                            className={`form-control ${formErrors.groupSize ? "is-invalid" : ""}`}
                                            placeholder="Group Size"
                                            value={newTrip.groupSize}
                                            onChange={handleChange}
                                        />
                                        {formErrors.groupSize && <div className="invalid-feedback">{formErrors.groupSize}</div>}
                                    </div>
                                    <div className="col-md-4 mt-3">
                                        <select
                                            name="categoriesId"
                                            className={`form-control ${formErrors.categoriesId ? "is-invalid" : ""}`}
                                            value={newTrip.categoriesId}
                                            onChange={(e) => {
                                                const selectedValues = Array.from(e.target.selectedOptions).map(option => Number(option.value));
                                                setNewTrip({ ...newTrip, categoriesId: selectedValues });
                                            }}
                                            multiple
                                        >
                                            <option value="">Select Categories</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>

                                        {formErrors.categoriesId && <div className="invalid-feedback">{formErrors.categoriesId}</div>}
                                    </div>

                                    <div className="col-md-12 mt-3">
                                        <button type="submit" className="btn btn-primary me-2">
                                            Save Trip
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Trip Name</th>
                                <th>Destination</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Budget</th>
                                <th>Group Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {paginatedTrips.map((trip) => (
                                <tr key={trip.id}>
                                    <td>
                                        {editingTrip && editingTrip.id === trip.id ? (
                                            <input
                                                type="text"
                                                name="tripName"
                                                value={editingTrip.tripName}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        ) : (
                                            trip.tripName
                                        )}
                                    </td>
                                    <td>{trip.destination}</td>
                                    {/* Sử dụng hàm formatDate để định dạng ngày */}
                                    <td>{formatDate(trip.startDate)}</td>
                                    <td>{formatDate(trip.endDate)}</td>
                                    <td>{trip.budget}</td>
                                    <td>{trip.groupSize}</td>
                                    <td>
                                        {editingTrip && editingTrip.id === trip.id ? (
                                            <>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="btn btn-success btn-sm me-2"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(trip)}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(trip.id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <button
                        className="btn btn-secondary"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default TripList;
