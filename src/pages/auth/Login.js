import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { auth, googleAuthProvider } from "../../firebase";
import { Button } from "antd";
import { GoogleOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { LOGGED_IN_USER } from "../../actionTypes/userActionTypes";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../services/authService";

const Login = ({ history }) => {
  const [email, setEmail] = useState("nikolav54@gmail.com");
  const [password, setPassword] = useState("masina123");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const roleBasedRedirect = (res) => {
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
  }, [user, history]);

  let dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: LOGGED_IN_USER,
            payload: {
              email: res.data.email,
              token: idTokenResult.token,
              name: res.data.name,
              role: res.data.role,
              _id: res.data._id,
            },
          });
          roleBasedRedirect(res);
        })
        .catch((e) => console.log(e));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: LOGGED_IN_USER,
              payload: {
                email: res.data.email,
                token: idTokenResult.token,
                name: res.data.name,
                role: res.data.role,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res);
          })
          .catch((e) => console.log(e));
      })
      .catch((error) => {
        toast.error(error.message);
        console.error(error);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your Password "
        />
      </div>

      <br />
      <Button
        onClick={handleSubmit}
        type="primary"
        className="mb-3"
        icon={<MailOutlined />}
        block
        shape="round"
        size="large"
        disabled={!email || password.length < 6}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {!loading ? (
            <h4>Login</h4>
          ) : (
            <h4 className="text-danger">Loading. . .</h4>
          )}
          {loginForm()}
          <Button
            onClick={googleLogin}
            type="danger"
            icon={<GoogleOutlined />}
            block
            shape="round"
            size="large"
          >
            Login with Google
          </Button>
          <Link
            to={"/forgot/password"}
            className="float-right text-danger mt-2"
          >
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
