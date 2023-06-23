import React, { useId, useState } from "react";
import { Avatar } from "@mui/material/";
import "./ClubListItem.css";
import { useNavigate } from "react-router-dom";

const ClubListItem = (props) => {
  const navigate = useNavigate();
  const [avatarImg, setAvatarImg] = useState(
    "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
  );

  return (
    <div className="club-component">
      <div className="club-c-left-top">
        <Avatar
          className="club-avatar"
          sx={{ width: 84, height: 84 }}
          src={avatarImg}
        />
        <h6>{props.clubName}</h6>
        <button
          className="view-button-style"
          onClick={() => {
            navigate(`/club/${props.clubId}`);
          }}
        >
          View
        </button>
      </div>
    </div>
  );
};

export default ClubListItem;
