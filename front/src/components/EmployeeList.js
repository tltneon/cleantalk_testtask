import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const fetchEmployees = async (pageNumber) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api.php?page=${pageNumber}`);
            const newEmployees = response.data;

            setEmployees(prevEmployees => [...prevEmployees, ...newEmployees]);
            
            if (newEmployees.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        fetchEmployees(page);
    }, [page]);

    const handleScroll = () => {
        if (loader.current) {
            const loaderPosition = loader.current.getBoundingClientRect();
            if (loaderPosition.top <= window.innerHeight) {
                setPage(prevPage => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="container mt-2">
            <h3>Employee List</h3>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Position</th>
                        <th>Email</th>
                        <th>Home Phone</th>
                        <th>Notes</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index}>
                            <td>{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td>{employee.position}</td>
                            <td>{employee.email}</td>
                            <td>{employee.home_phone}</td>
                            <td>{employee.notes}</td>
                            <td><button className='btn btn-primary btn-sm'><Link className="nav-link" to={`/edit/${employee.id}`}>Edit</Link></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {hasMore && <div ref={loader} style={{ height: '20px', textAlign: 'center' }}>Loading...</div>}
        </div>
    );
};

export default EmployeeList;