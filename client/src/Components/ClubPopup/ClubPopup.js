import React, { useState } from 'react'
import { Avatar } from '@mui/material/';
import "./ClubPopup.css"


const ClubPopup = (props) => {
    const [avatarImg, setAvatarImg] = useState("https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg");
    const [clubName, setClubName] = useState(props.clubName);
    const [clubCollege, setClubCollege] = useState(props.clubCollege);
    const [clubDescription, setClubDescription] = useState(props.clubDescription);
    return (
        <div className='club-popup'>
            <Avatar className='club-avatar' sx={{ width: 84, height: 84 }} src={avatarImg} />
            <h3>Club Name</h3>
            <p>{clubName}</p>
            <h3>College Name</h3>
            <p>{clubCollege}</p>
            <h3>Club Description</h3>
            <p>{clubDescription}</p>
        </div>
    )
}

export default ClubPopup;