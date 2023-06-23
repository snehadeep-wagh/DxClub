import React from 'react';
import {Navigate, Outlet} from 'react-router-dom';
const AuthPrivateComponent = () => {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/dashboard"/> : <Navigate to="/login"/>;
}

export default AuthPrivateComponent;