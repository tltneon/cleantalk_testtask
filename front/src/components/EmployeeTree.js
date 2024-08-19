import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EmployeeTreeBranch from './EmployeeTreeBranch';

const EmployeeTree = () => {
    const [employees, setEmployees] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const fetchEmployees = async (pageNumber, master = 0) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api.php?master=${master}&page=${pageNumber}`);
            const newEmployees = response.data;

            if (master > 0 && newEmployees.length > 0) {
                employees.find((item) => Number(item.id) === Number(master))['sub'] = newEmployees;
                setHasMore(false);
                setEmployees(employees);
                setHasMore(true);
            }
            setEmployees(prevEmployees => [...prevEmployees, ...newEmployees]); // заставляем перерендерить
            
            if (master === 0 && newEmployees.length === 0) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    useEffect(() => {
        fetchEmployees(page); // eslint-disable-next-line
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
            <h3>Employee Tree</h3>
            <ul id="myUL">
                <EmployeeTreeBranch employees={employees} fetchEmployees={fetchEmployees}></EmployeeTreeBranch>
            </ul>
            {hasMore && <div ref={loader} style={{ height: '20px', textAlign: 'center' }}>Loading...</div>}
        </div>
    );
};

export default EmployeeTree;