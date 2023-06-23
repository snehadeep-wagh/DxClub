import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="mt-8">
      <div className="surface-0 text-center mt-5">
        <div className="grid">
          <div
            className="col-12 md:col-4 mb-4 px-5"
            onClick={() => {
              navigate("/new-club");
            }}
          >
            <span
              className="p-3 shadow-2 mb-3 inline-block"
              style={{ borderRadius: "10px" }}
            >
              <i className="pi pi-plus text-4xl text-blue-500 cursor-pointer"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Create Club</div>
            <span className="text-700 line-height-3">
              Create a new club from your college onto our platform
            </span>
          </div>
          <div
            className="col-12 md:col-4 mb-4 px-5"
            onClick={() => {
              navigate("/my-clubs");
            }}
          >
            <span
              className="p-3 shadow-2 mb-3 inline-block"
              style={{ borderRadius: "10px" }}
            >
              <i className="pi pi-users text-4xl text-blue-500 cursor-pointer"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">My Clubs</div>
            <span className="text-700 line-height-3">
              View all your existing clubs and modify any club where you are an
              admin
            </span>
          </div>
          <div
            className="col-12 md:col-4 mb-4 px-5"
            onClick={() => {
              navigate("/all-clubs");
            }}
          >
            <span
              className="p-3 shadow-2 mb-3 inline-block"
              style={{ borderRadius: "10px" }}
            >
              <i className="pi pi-user-plus text-4xl text-blue-500 cursor-pointer"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">Join Club</div>
            <span className="text-700 line-height-3">
              Send a join request to an existing club that will be approved by
              the club administrator
            </span>
          </div>

          <div
            className="col-12 md:col-4 mb-4 px-5"
            onClick={() => {
              navigate("/clubs-join-request");
            }}
          >
            <span
              className="p-3 shadow-2 mb-3 inline-block"
              style={{ borderRadius: "10px" }}
            >
              <i className="pi pi-envelope text-4xl text-blue-500 cursor-pointer"></i>
            </span>
            <div className="text-900 text-xl mb-3 font-medium">
              Club Join Request
            </div>
            <span className="text-700 line-height-3">
              All the requests for joining the club which you have created.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
