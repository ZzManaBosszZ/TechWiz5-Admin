import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../../layouts";
import BreadCrumb from "../../layouts/BreadCrumb";
import api from "../../../services/api";
import url from "../../../services/url";
import { getAccessToken } from '../../../utils/auth';

function UserList() {
    const [users, setUsers] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const fetchUsers = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${getAccessToken()}`,
            };
            const response = await api.get(url.AUTH.LIST_USER, { headers });
            setUsers(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const paginatedUsers = users.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    const totalPages = Math.ceil(users.length / rowsPerPage);

    return (
        <Layout>
            <ToastContainer />
            <div className="container mt-5">
                <h1 className="mb-4">User List</h1>
                <BreadCrumb title="User List" />

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.fullName}</td> 
                                    <td>{user.email}</td>
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

export default UserList;
