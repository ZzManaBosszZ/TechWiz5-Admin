import React, { useState } from "react";
import { FaEdit, FaCheck, FaTimes, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";

function CategoryList() {
    const [phases, setPhases] = useState([
        { id: 1, name: "Planning", startDate: new Date(), endDate: new Date(new Date().setDate(new Date().getDate() + 30)), status: "Not Started" },
        { id: 2, name: "Development", startDate: new Date(new Date().setDate(new Date().getDate() + 31)), endDate: new Date(new Date().setDate(new Date().getDate() + 90)), status: "Not Started" },
        { id: 3, name: "Testing", startDate: new Date(new Date().setDate(new Date().getDate() + 91)), endDate: new Date(new Date().setDate(new Date().getDate() + 120)), status: "Not Started" },
        { id: 4, name: "Deployment", startDate: new Date(new Date().setDate(new Date().getDate() + 121)), endDate: new Date(new Date().setDate(new Date().getDate() + 150)), status: "Not Started" },
    ]);

    const [editingPhase, setEditingPhase] = useState(null);
    const [isAdding, setIsAdding] = useState(false); // State to control adding mode
    const [newPhase, setNewPhase] = useState({
        name: "",
        startDate: new Date(),
        endDate: new Date(),
        status: "Not Started",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;
    const totalPages = Math.ceil(phases.length / rowsPerPage);

    const handleEdit = (phase) => {
        setEditingPhase({ ...phase });
    };

    const handleSave = () => {
        setPhases(phases.map((phase) => (phase.id === editingPhase.id ? editingPhase : phase)));
        setEditingPhase(null);
    };

    const handleCancel = () => {
        setEditingPhase(null);
    };

    const handleChange = (field, value) => {
        setEditingPhase({ ...editingPhase, [field]: value });
    };

    const handleAddChange = (field, value) => {
        setNewPhase({ ...newPhase, [field]: value });
    };

    const handleAddPhase = () => {
        setPhases([...phases, { ...newPhase, id: phases.length + 1 }]);
        setIsAdding(false);
        setNewPhase({
            name: "",
            startDate: new Date(),
            endDate: new Date(),
            status: "Not Started",
        });
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const paginatedPhases = phases.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Project Timeline Table</h1>

            {/* Add Phase Button */}
            <button
                className="btn btn-success mb-4"
                onClick={() => setIsAdding(true)}
            >
                <FaPlus /> Add Phase
            </button>

            {/* Add Phase Form */}
            {isAdding && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h5>Add New Phase</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <label>Phase Name</label>
                                <input
                                    type="text"
                                    value={newPhase.name}
                                    onChange={(e) => handleAddChange("name", e.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Start Date</label>
                                <DatePicker
                                    selected={newPhase.startDate}
                                    onChange={(date) => handleAddChange("startDate", date)}
                                    className="form-control"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className="col-md-4">
                                <label>End Date</label>
                                <DatePicker
                                    selected={newPhase.endDate}
                                    onChange={(date) => handleAddChange("endDate", date)}
                                    className="form-control"
                                    dateFormat="dd/MM/yyyy"
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Status</label>
                                <select
                                    value={newPhase.status}
                                    onChange={(e) => handleAddChange("status", e.target.value)}
                                    className="form-select"
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="col-md-12 mt-3">
                                <button className="btn btn-primary me-2" onClick={handleAddPhase}>
                                    Save Phase
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setIsAdding(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Phase Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPhases.map((phase) => (
                            <tr key={phase.id}>
                                <td>
                                    {editingPhase && editingPhase.id === phase.id ? (
                                        <input
                                            type="text"
                                            value={editingPhase.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        phase.name
                                    )}
                                </td>
                                <td>
                                    {editingPhase && editingPhase.id === phase.id ? (
                                        <DatePicker
                                            selected={editingPhase.startDate}
                                            onChange={(date) => handleChange("startDate", date)}
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    ) : (
                                        phase.startDate.toLocaleDateString("en-GB")
                                    )}
                                </td>
                                <td>
                                    {editingPhase && editingPhase.id === phase.id ? (
                                        <DatePicker
                                            selected={editingPhase.endDate}
                                            onChange={(date) => handleChange("endDate", date)}
                                            className="form-control"
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    ) : (
                                        phase.endDate.toLocaleDateString("en-GB")
                                    )}
                                </td>
                                <td>
                                    {editingPhase && editingPhase.id === phase.id ? (
                                        <select
                                            value={editingPhase.status}
                                            onChange={(e) => handleChange("status", e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="Not Started">Not Started</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={`badge ${phase.status === "Completed" ? "bg-success" : phase.status === "In Progress" ? "bg-warning" : "bg-danger"}`}
                                        >
                                            {phase.status}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {editingPhase && editingPhase.id === phase.id ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="btn btn-success btn-sm me-2"
                                                aria-label="Save changes"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="btn btn-danger btn-sm"
                                                aria-label="Cancel changes"
                                            >
                                                <FaTimes />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleEdit(phase)}
                                            className="btn btn-primary btn-sm"
                                            aria-label="Edit phase"
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
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
    );
};

export default CategoryList;