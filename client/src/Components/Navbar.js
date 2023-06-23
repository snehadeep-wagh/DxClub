import React from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const start = (
    <h2
      className="mr-2 cursor-pointer font-bold mt-2 ml-4"
      onClick={() => {
        navigate("/");
      }}
    >
      DxClub
    </h2>
  );
  const end = <span></span>;
  const token = localStorage.getItem("token");
  const authList = [
    {
      label: "Dashboard",
      url: "/dashboard",
    },
    {
      label: "Profile",
      url: "/profile",
      style: { color: "white" },
    },
  ];
  const unAuthList = [{ label: "About" }];
  const items = token ? authList : unAuthList;

  return (
    <div className="card">
      <Menubar
        className="bg-primary h-3rem border-noround text-white"
        model={items}
        start={start}
        end={end}
      />
    </div>
  );
}

export default Navbar;
