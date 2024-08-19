import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployeeTreeBranch = ({employees, fetchEmployees}) => {
    const [page, setPage] = useState([]);
    const getPage = (employee) => {
        return page[employee] ?? 1;
    }
    const updatePage = (employee) => {
        let newPage = page;
        if (!newPage[employee]) {
            newPage[employee] = 2;
        } else {
            newPage[employee]++;
        }
        setPage(newPage);
    }
    return (
        employees.map((employee) => (
            <div>
                <li key={employee.id} className='list-group-item'>
                    <button className='btn btn-primary btn-sm' onClick={() => {fetchEmployees(getPage(employee.id), employee.id); updatePage(employee.id);}} title="Load subordinates">&rarr;</button>
                    <span style={{display: "inline-block", margin: "0 10px"}}>{employee.first_name} {employee.last_name} ({employee.position})</span>
                    
                    <button className='btn btn-primary btn-sm'><Link className="nav-link" to={`/edit/${employee.id}`}  title="Edit employee">Edit</Link></button>
                </li>
                {employee.sub ? (
                    <li><ul><EmployeeTreeBranch employees={employee.sub} fetchEmployees={fetchEmployees}></EmployeeTreeBranch></ul></li>
                ) : ""}
            </div>
        ))
    );
};

export default EmployeeTreeBranch;