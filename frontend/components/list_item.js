
import React from "react";
import { useState } from "react";

export default function List_item(props) {
    const [exit, setExit] = useState('');
    

    const handleUpdate = () => {
        props.updateEntry(props.id,props.start_date,exit)
    }

    
    return (
        <li className="list-group-item d-flex justify-content-between align-items-center"> 
            
            <p>{props.start_date}</p> 
    
            {props.end_date == null ? <div className="row">
                <div className="col-7 p-0">
                    <input type="datetime-local" className="form-control"  onChange={e => setExit(e.target.value)}/>
                </div>
                <div className="col-5 p-0">
                <button class="btn btn-primary" type="button" onClick={handleUpdate}>Clock-Out</button>
                </div>
            
            </div>:<p>{props.end_date}</p> }
            
            
        </li>
);
}