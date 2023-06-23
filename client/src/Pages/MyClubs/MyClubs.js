import React, { useEffect, useState } from "react";
import "./MyClubs.css";
import ClubListItem from "../../Components/ClubListItem/ClubListItem";

const MyClubs = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [listOfClubs, setLisOfClubs] = useState([]);
  const [userID, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getMyClubs();
  }, []);

  const getMyClubs = async () => {
    let result = await fetch(BASE_URL + "profile/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });

    if (result.status === 200) {
      result = await result.json();
      console.log(result);
      setLisOfClubs(result.clubIds);
      setUserId(result._id);
      setUserName(result.name);
      // listOfClubs = result.result;
    } else {
      console.log("Something went wrong!");
    }
  };

  const listClubs = listOfClubs.map((clubComponent) => (
    <div key={clubComponent.clubId}>
      <ClubListItem
        userId={userID}
        userName={userName}
        clubId={clubComponent.clubId}
        clubName={clubComponent.clubName}
        contractAddress={clubComponent.contractAddress}
      />
    </div>
  ));

  return (
    <div>
      <h2 className="text-center mt-5">My Clubs</h2>
      <div className="all-clubs">{listClubs}</div>
    </div>
  );
};

export default MyClubs;
