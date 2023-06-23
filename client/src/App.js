import React from "react";
import { Routes, Route } from "react-router-dom";

import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import ForgetPasswordPage from "./Pages/ForgotPasswordPage/ForgetPasswordPage";
import PrivateComponent from "./Components/PrivateComponent";
import DashboardPage from "./Pages/DashboardPage/DashboardPage";
import "./App.css";
import ClubPage from "./Pages/ClubPage/ClubPage";
import PageNotFound from "./Pages/PageNotFound/PageNotFound";
import NewProposal from "./Pages/NewProposals/NewProposals";
import MyClubs from "./Pages/MyClubs/MyClubs";
import NewClubPage from "./Components/NewClub/NewClub";
import AllClubs from "./Components/AllClubs/AllClubs";
import HomePage from "./Pages/HomePage/HomePage";
import Navbar from "./Components/Navbar";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
//primeflex-css
import "primeflex/primeflex.css";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import ClubJoinRequest from "./Components/ClubJoinRequest/ClubJoinRequest";
import AuthPrivateComponent from "./Components/AuthPrivateComponent";

export default function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<PageNotFound />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />

        {/* All private routes in this->*/}
        <Route element={<PrivateComponent />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/club/:clubId" element={<ClubPage />} />
          <Route path="/all-clubs" element={<AllClubs />} />
          <Route path="/my-clubs" element={<MyClubs />} />
          <Route path="/clubs-join-request" element={<ClubJoinRequest />} />
          <Route path="/new-proposal/:contractAddress" element={<NewProposal />} />
          <Route path="/new-club" element={<NewClubPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="." />
      </Routes>
    </div>
  );
}
