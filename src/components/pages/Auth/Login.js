import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDecodedToken, removeAccessToken, setAccessToken } from "../../../utils/auth";
import config from "../../../config/index";
import api from "../../../services/api";
import url from "../../../services/url";

function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [formErrors, setFormErrors] = useState({
        email: "",
        password: "",
    });

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = "Please enter your email address.";
            valid = false;
        }

        if (!formData.password) {
            newErrors.password = "Please enter your password.";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
            valid = false;
        } else if (formData.password.length > 50) {
            newErrors.password = "Password must be less than 50 characters.";
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const loginRequest = await api.post(url.AUTH.LOGIN, formData);

                if (loginRequest.status === 200) {
                    const token = loginRequest.data.token;
                    setAccessToken(token);

                    const decodeToken = getDecodedToken();
                    let accountRole = decodeToken.Role[0].authority;

                    let redirectUrl = "";
                    if (accountRole === "ADMIN" || accountRole === "USER") {
                        redirectUrl = "/";
                    } else if (accountRole === "") {
                        removeAccessToken();
                        setFormErrors({
                            email: "Invalid email or password.",
                            password: "Invalid email or password.",
                        });
                    }

                    navigate(redirectUrl);
                } else {
                    setFormErrors({
                        email: "Invalid email or password.",
                        password: "Invalid email or password.",
                    });
                }
            } catch (error) {
                setFormErrors({
                    email: "Invalid email or password.",
                    password: "Invalid email or password.",
                });
            }
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg mt-5">
                        <div className="card-header">
                            <h3 className="text-center font-weight-light my-4">Login</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleLogin}>
                                <div className="form-floating mb-3">
                                    <input
                                        className="form-control"
                                        id="inputEmail"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                    />
                                    <label htmlFor="inputEmail">Email address</label>
                                    {formErrors.email && <p className="text-danger">{formErrors.email}</p>}
                                </div>
                                <div className="form-floating mb-3">
                                    <input
                                        className="form-control"
                                        id="inputPassword"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                    <label htmlFor="inputPassword">Password</label>
                                    {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        id="inputRememberPassword"
                                        type="checkbox"
                                        value=""
                                    />
                                    <label className="form-check-label" htmlFor="inputRememberPassword">
                                        Remember Password
                                    </label>
                                </div>
                                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                    <Link className="small" to="/forgot-password">
                                        Forgot Password?
                                    </Link>
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* <div className="card-footer text-center py-3">
                            <div className="small">
                                <Link to="/register">Need an account? Sign up!</Link>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
