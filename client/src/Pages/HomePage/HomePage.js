import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { Button } from "primereact/button";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="grid grid-nogutter surface-0 text-800">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
          <section>
            <span className="block text-6xl font-bold mb-1">
              Empowering college clubs with a decentralized approach to governance
            </span>
            {/* <div className="text-6xl text-primary font-bold mb-3">
              Decentralized governance
            </div> */}
            <div className=""></div>
            <Button
              label="Register"
              type="button"
              className="mt-5 mr-3 p-button-raised"
              onClick={() => {
                navigate("/register");
              }}
            />
            <Button
              label="Login"
              type="button"
              className="mt-5 p-button-outlined"
              onClick={() => {
                navigate("/login");
              }}
            />
          </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden mt-5">
          <img
            src="images/community.svg"
            alt="hero-1"
            className="md:ml-auto block md:h-full"
            style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
          />
        </div>
      </div>

      {/* <div className="Home">
        <button
          className="general-button"
          onClick={() => {
            navigate("/register");
          }}
        >
          register
        </button>
      </div> */}
    </>
  );
};

export default HomePage;
