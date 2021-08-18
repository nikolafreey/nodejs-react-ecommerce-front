import React, { useState } from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { LOGGED_OUT } from "../../actionTypes/userActionTypes";
import SearchForm from "../forms/SearchForm";

const { SubMenu } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("");
  let dispatch = useDispatch();
  let { user } = useSelector((state) => ({ ...state }));
  let history = useHistory();

  const handleClick = (event) => {
    setCurrent(event.key);
  };

  const logout = () => {
    firebase.auth().signOut();

    dispatch({
      type: LOGGED_OUT,
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="shop" icon={<ShoppingOutlined />}>
        <Link to="/shop">Shop</Link>
      </Menu.Item>
      {!user && (
        <Menu.Item
          key="register"
          icon={<UserAddOutlined />}
          className="float-right"
        >
          <Link to="/register">Register</Link>
        </Menu.Item>
      )}
      {!user && (
        <Menu.Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Menu.Item>
      )}
      {user && (
        <SubMenu
          key="SubMenu"
          icon={<SettingOutlined />}
          title={user.email.split("@")[0]}
        >
          {user && user.role === "subscriber" && (
            <Menu.Item>
              <Link to="/user/history">Dashboard</Link>
            </Menu.Item>
          )}
          {user && user.role === "admin" && (
            <Menu.Item>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>
          )}

          <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Menu.Item>
        </SubMenu>
      )}
      <span className="float-right p-1">
        <SearchForm />
      </span>
    </Menu>
  );
};

export default Header;
