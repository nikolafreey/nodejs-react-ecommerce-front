import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoginToRedirect";

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));

  return user && user.token ? (
    <Route {...rest} />
  ) : (
    <LoadingToRedirect />
    // <h1 className="text-danger">"Loading. . ."</h1>
  );
};

export default UserRoute;
