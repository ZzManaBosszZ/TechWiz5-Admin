import React, { useState, useEffect } from "react";
import { FaEdit, FaCheck, FaTimes, FaPlus, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../../layouts";
import BreadCrumb from "../../layouts/BreadCrumb";
import api from "../../../services/api";
import url from "../../../services/url";
import { getAccessToken } from '../../../utils/auth';

function CategoryList() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const [newCategory, setNewCategory] = useState({
        name: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    const [formErrors, setFormErrors] = useState({
        name: "",
    });

    const validateForm = (category) => {
        let valid = true;
        const newErrors = {};
        if (!category.name) {
            newErrors.name = "Please enter a name.";
            valid = false;
        } else if (category.name.length < 3) {
            newErrors.name = "Name must be at least 3 characters.";
            valid = false;
        } else if (category.name.length > 255) {
            newErrors.name = "Name must be less than 255 characters.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingCategory) {
            setEditingCategory({ ...editingCategory, [name]: value });
        } else {
            setNewCategory({ ...newCategory, [name]: value });
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
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryToSave = editingCategory || newCategory;
        if (validateForm(categoryToSave)) {
            try {
                const headers = {
                    Authorization: `Bearer ${getAccessToken()}`,
                };

                let response;
                if (editingCategory) {
                    response = await api.put(`${url.CATEGORY.EDIT}`, categoryToSave, { headers });
                    setEditingCategory(null);
                } else {
                    response = await api.post(url.CATEGORY.CREATE, categoryToSave, { headers });
                    setNewCategory({ name: "" });
                }

                if (response && response.data) {
                    toast.success("Category saved successfully!");
                    fetchCategories();  // Refresh the list
                    setIsAdding(false);
                }
            } catch (error) {
                toast.error("Failed to save category.");
            }
        }
    };

    const handleEdit = (category) => {
        // Accessing the category ID here
        console.log('Editing category with ID:', category.id);
        setEditingCategory({ ...category });
    };

    const handleDelete = async (id) => {
        console.log('Deleting category with ID:', id);
        try {
            const headers = {
                Authorization: `Bearer ${getAccessToken()}`,
            };
            await api.delete(`${url.CATEGORY.DELETE}`, { headers, data: [id]   });
            toast.success("Category deleted successfully!");
            fetchCategories();  // Refresh the list after deletion
        } catch (error) {
            toast.error("Failed to delete category.");
        }
    };

    const handleCancel = () => {
        setEditingCategory(null);
        setIsAdding(false);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const paginatedCategories = categories.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil(categories.length / rowsPerPage);

    return (
        <Layout>
            <ToastContainer />
            <div className="container mt-5">
                <h1 className="mb-4">Category List</h1>
                <BreadCrumb title="Category List" />

                <button
                    className="btn btn-success mb-4"
                    onClick={() => setIsAdding(true)}
                >
                    <FaPlus /> Add Category
                </button>

                {isAdding && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5>Add New Category</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            name="name"
                                            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                                            placeholder="Category Name"
                                            value={newCategory.name}
                                            onChange={handleChange}
                                            autoFocus
                                        />
                                        {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                                    </div>
                                    <div className="col-md-12 mt-3">
                                        <button type="submit" className="btn btn-primary me-2">
                                            Save Category
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
                                <th>Category Name</th>
                                <th>Created By</th> {/* New Column */}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.map((category) => (
                                <tr key={category.id}>
                                    <td>
                                        {editingCategory && editingCategory.id === category.id ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={editingCategory.name}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        ) : (
                                            category.name
                                        )}
                                    </td>
                                    <td>{category.createdBy}</td> {/* Display Created By */}
                                    <td>
                                        {editingCategory && editingCategory.id === category.id ? (
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
                                                    onClick={() => handleEdit(category)}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
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

export default CategoryList;
