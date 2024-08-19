import React from 'react';
import axios from 'axios';

function ServicePage() {
    const execTask = (task) => {
        axios.get(`${process.env.REACT_APP_API_HOST}/api.php?task=${task}`)
        .catch(error => {
            console.error(`Error while executing ${task}`, error);
        });
    };

    return (
        <div>
            <button className='btn btn-primary' onClick={() => execTask('migrate')}>Migration</button>
            <button className='btn btn-primary' onClick={() => execTask('fill')}>Fill table (10k)</button>
        </div>
    );
}

export default ServicePage;