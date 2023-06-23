import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Inplace, InplaceDisplay, InplaceContent } from "primereact/inplace";
import { InputText } from "primereact/inputtext";
import { Avatar } from "@mui/material/";

const myProfileStyles = {
  fieldItem:
    "flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap",
  fieldName: "text-500 w-6 md:w-3 font-medium",
  fieldValue:
    "text-900 mt-3 md:mt-0 w-full md:w-7 md:flex-order-0 flex-order-1",
};

function ProfilePage() {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [myClass, setMyClass] = useState("");
  const [division, setDivision] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const [avatarImg, setAvatarImg] = useState(
    "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
  );

  const getProfile = async () => {
    let result = await fetch(BASE_URL + "profile/", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });

    if (result.status === 200) {
      result = await result.json();
      setId(result?._id);
      setName(result?.name);
      setCollegeName(result?.collegeName);
      setRollNumber(result?.rollNumber);
      setMyClass(result?.class);
      setDivision(result?.division);
      setDepartment(result?.department);
      setPhone(result?.phone);
    } else {
      console.log("Something went wrong!");
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();

    const requestBody = {
      _id: id,
      name: name,
      collegeName: collegeName,
      rollNumber: rollNumber,
      class: myClass,
      division: division,
      department: department,
      phone: phone,
    };

    const options = {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(BASE_URL + "profile/", options);
    console.log(response);
  };

  const uploadImage = () => {

  };

  return (
    <div className="surface-0 m-5">
      <div className="font-medium text-3xl text-900 mb-3">My Profile</div>
      <div className="text-500 mb-5">
        Click on the respective field to edit it
      </div>
      <ul className="list-none p-0 m-0">
        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>Name</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {name || <span className="text-500">Enter your name</span>}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>
        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>College Name</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {collegeName || (
                  <span className="text-500">Enter name of your college</span>
                )}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>
        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>Department</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {department || (
                  <span className="text-500">Enter your department</span>
                )}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>
        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>Class</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {myClass || (
                  <span className="text-500">Enter your class name</span>
                )}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={myClass}
                  onChange={(e) => setMyClass(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>

        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>Division</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {division || (
                  <span className="text-500">Enter your division</span>
                )}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>
        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>Roll Number</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {rollNumber || (
                  <span className="text-500">Enter your roll number</span>
                )}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>
        <li className={myProfileStyles.fieldItem}>
          <div className={myProfileStyles.fieldName}>Phone Number</div>
          <div className={myProfileStyles.fieldValue}>
            <Inplace closable>
              <InplaceDisplay>
                {phone || (
                  <span className="text-500">Enter your phone number</span>
                )}
              </InplaceDisplay>
              <InplaceContent>
                <InputText
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          </div>
        </li>
        <li className={myProfileStyles.fieldItem}>
          <Button
            onClick={updateProfile}
            label="Save Changes"
            className="w-full"
          />
        </li>
      </ul>
    </div>
  );
}

export default ProfilePage;
