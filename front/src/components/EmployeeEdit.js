import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeEdit() {
    const emptyData = {
        first_name: '',
        last_name: '',
        position: '',
        email: '',
        home_phone: '',
        notes: '',
        master_id: 0,
    };
    const [selectedMaster, setSelectedMaster] = useState(0);
    const [formData, setFormData] = useState(emptyData);
    const [options, setOptions] = useState([]);
    let { id } = useParams();
    const navigate = useNavigate();
    const isNewEmployee = Number(id) === 0;
    const updateData = (data) => {
        if (data[0]) {
            setFormData(data[0]);
            if (data[0].master_id) {
                getEmployee(data[0].master_id, setOptions);
                setSelectedMaster(data[0].master_id);
            }
        }
    }

    useEffect(() => {
        setFormData(emptyData);
        if (!isNewEmployee) {
            getEmployee(id, updateData);
        } // eslint-disable-next-line
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${process.env.REACT_APP_API_HOST}/api.php?employeeid=${id}`, formData)
        .then(response => {
            alert('Data updated successfully');
            if (response.data.id) {
                navigate(`/edit/${response.data.id}`);
            }
        })
        .catch(error => {
            console.error('Error updating employee data', error);
        });
    };

    const getEmployee = (employeeid, callback) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/api.php?employeeid=${employeeid}`)
        .then(response => {
            if (response.data) {
                callback(response.data);
            }
        })
        .catch(error => {
            console.error('Error fetching employee data', error);
        });
    }

    const findEmployee = (e) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/api.php?find=${e.target.value}`)
        .then(response => {
            setOptions(response.data);
        })
        .catch(error => {
            console.error('Error fetching employee list', error);
        });
    }

    const deleteEmployee = (e) => {
        e.preventDefault();
        axios.delete(`${process.env.REACT_APP_API_HOST}/api.php?employeeid=${id}`)
        .then(response => {
            alert('Deleted successfully');
            navigate('/');
        })
        .catch(error => {
            console.error('Error deleting employee', error);
        });
    }

    const changeMaster = (e) => {
        setSelectedMaster(e.target.value);
        axios.post(`${process.env.REACT_APP_API_HOST}/api.php?employeeid=${id}`, {'master': e.target.value})
        .then(response => {
            alert('Changed successfully');
        })
        .catch(error => {
            console.error('Error changing master', error);
        });
    }

    return (
        <div>        
            <form onSubmit={handleSubmit} className='form-inline' style={{maxWidth: '500px', margin: 'auto'}}>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="first_name">First Name:</label>
                    <input className="form-control" type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
                </div>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="last_name">Last Name:</label>
                    <input className="form-control" type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="position">Position:</label>
                    <input className="form-control" type="text" id="position" name="position" value={formData.position} onChange={handleChange} />
                </div>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="email">Email:</label>
                    <input className="form-control" type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="home_phone">Phone:</label>
                    <input className="form-control" type="tel" id="home_phone" name="home_phone" value={formData.home_phone} onChange={handleChange} />
                </div>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="notes">Notes:</label>
                    <input className="form-control" type="tel" id="notes" name="notes" value={formData.notes} onChange={handleChange} />
                </div>
                <button className='btn btn-success' type="submit">{isNewEmployee ? "Create" : "Save"}</button>
                {isNewEmployee ? "" : <button className='btn btn-danger' onClick={deleteEmployee}>Delete</button>}
            </form>

            {isNewEmployee ? "" :
            <div className='mt-5' style={{maxWidth: '500px', margin: 'auto'}}>
                <div className='input-group'>
                    <label className='col-sm-2 col-form-label' htmlFor="find_by_name">Find employee:</label>
                    <input className="form-control" type="text" id="find_by_name" name="find_by_name" onChange={findEmployee} />
                </div>
                <div className='input-group' >
                    <label className='col-sm-2 col-form-label' htmlFor="first_name">Select master:</label>
                    <select id="master" name="master" value={selectedMaster} onChange={changeMaster}>
                        <option key='0' value='0'>No-one</option>
                        {options.map((option, index) => (
                            <option key={index} value={option.id}>
                                [{option.id}] {option.first_name} {option.last_name} ({option.position})
                            </option>
                        ))}
                    </select>
                </div>
            </div>}
        </div>
    );
}

export default EmployeeEdit;