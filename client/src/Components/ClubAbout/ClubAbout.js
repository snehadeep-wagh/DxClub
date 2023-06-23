import React, { useState } from 'react'
import './ClubAbout.css'
import { Avatar } from '@mui/material/';

const ClubAbout = () => {
    const [adminName, setAdminName] = useState("AdminName");
    const [adminImg, setAdminImg] = useState("https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg");

    return (
        <div>
            <h2 className='proposals'>About</h2>
            <div className='member-container'>
                <p style={{ fontWeight: "bold", fontSize: "medium" }}>Members</p>
                <div className='member-container-i'>
                    <div className='member-container-i-top'>
                        <Avatar className='about-avatar' sx={{ width: 24, height: 24 }} src={adminImg} />
                        <p>{adminName}</p>
                    </div>
                    <div>
                        <p className='admin-back'>admin</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClubAbout;