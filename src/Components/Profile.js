import React, { useState, useEffect } from "react";
import {login, updatePassword} from '../apiCalls/index';
import { useNavigate } from "react-router-dom";

function Profile({username, token})
{
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    return <div>
        <h1>Profile</h1>
        <button onClick = {() => {
            setPasswordOpen(!passwordOpen);
        }}> Change password</button>
        {passwordOpen? <>
            <form onSubmit = { async (event) => {
            event.preventDefault();
            const result = await login(username, oldPassword);
            if(result.error) alert('Old password is incorrect.');
            else{
                const change = await updatePassword(newPassword, token );
                console.log(change);
                alert('Password successfully changed.')
                setPasswordOpen(false);
            }
            }}>
            <input type = "text" placeholder = "old password" value = {oldPassword} onChange = {(event) => {
                setOldPassword(event.target.value);
            }}/>
            <input type = "text" placeholder = "new password" value = {newPassword} onChange = {(event) => {
                setNewPassword(event.target.value);
            }}/>
            <input type = "submit"/>
        </form>
        </>: null}

    </div>
}

export default Profile;