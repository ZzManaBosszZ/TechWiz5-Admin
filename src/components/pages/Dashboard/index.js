import React, { useEffect, useState } from "react";
import Layout from "../../layouts";
import BreadCrumb from "../../layouts/BreadCrumb";
import Chart from "react-apexcharts";
import api from "../../../services/api";
import url from "../../../services/url";
import { getAccessToken } from "../../../utils/auth";
import config from "../../../config";

function Home() {
    const [userCount, setUserCount] = useState(0);
    const [userData, setUserData] = useState({ labels: [], series: [] });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${getAccessToken()}`,
                };
                const response = await api.get(url.AUTH.LIST_USER, { headers });
                const data = await response.data;

                const users = data.data;
                setUserCount(users.length);

                // Prepare data for charts based on user data
                const labels = users.map((user, index) => `User ${index + 1}`);
                const values = Array(users.length).fill(1); // Each user counts as 1

                setUserData({
                    labels,
                    series: [{
                        name: "User Count",
                        data: values,
                    }],
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const lineChartOptions = {
        chart: {
            type: 'line',
            height: 350,
        },
        xaxis: {
            categories: userData.labels,
        },
        stroke: {
            curve: 'smooth',
        },
        title: {
            text: 'User Growth (Line)',
            align: 'left'
        },
        dataLabels: {
            enabled: false
        }
    };

    const barChartOptions = {
        chart: {
            type: 'bar',
            height: 350,
        },
        xaxis: {
            categories: userData.labels,
        },
        title: {
            text: 'User Growth (Bar)',
            align: 'left'
        },
        dataLabels: {
            enabled: true
        }
    };

    return (
        <Layout>
            <div className="container-fluid px-4">
                <h1 className="mt-4">Dashboard</h1>
                <BreadCrumb title="Dashboard" />
                <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-primary text-white mb-4">
                            <div className="card-body">Total Users: {userCount}</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href={config.routes.user_list}>View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-chart-area me-1"></i>
                                User Growth Chart (Line)
                            </div>
                            <div className="card-body">
                                {userData.labels.length > 0 && userData.series.length > 0 ? (
                                    <Chart options={lineChartOptions} series={userData.series} type="line" height={350} />
                                ) : (
                                    <p>No data available for the line chart.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-chart-bar me-1"></i>
                                User Growth Chart (Bar)
                            </div>
                            <div className="card-body">
                                {userData.labels.length > 0 && userData.series.length > 0 ? (
                                    <Chart options={barChartOptions} series={userData.series} type="bar" height={350} />
                                ) : (
                                    <p>No data available for the bar chart.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Home;
