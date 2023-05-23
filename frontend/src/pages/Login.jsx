import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";
// import "./Register.scss";

import toast from "react-hot-toast";
import axios from "../api/axios";

const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();

  const [user, resetUser, userAttribs] = useInput("user", "");

  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [check, toggleCheck] = useToggle("persist", false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        LOGIN_URL,
        { user, pwd },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setLoading(false);

      setAuth({
        userInfo: response?.data.userInfo,
        accessToken: response?.data?.accessToken,
        role: response?.data?.role,
      });
      resetUser();
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data.message);
      setLoading(false);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    // <div className="login">
    <div className="wrapper">
      <div className="text-center mt-4 name">Auth APP</div>
      <form id="input_form" onSubmit={handleSubmit} className="p-3 mt-3 ">
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            placeholder="Username"
            type="text"
            id="userName"
            ref={userRef}
            autoComplete="off"
            name="userName"
            {...userAttribs}
            required
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>

          <input
            type="password"
            id="password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            placeholder="Password"
            required
          />
        </div>
        <div className="text-center text-red mb-20">{errMsg}</div>

        <button className="btn mt-3 btn-primary btn-login">
          {loading ? "Loading" : "Login"}
        </button>

        <div className="persistCheck">
          <input
            type="checkbox"
            id="persist"
            onChange={toggleCheck}
            checked={check}
          />
          <label htmlFor="persist">Remember me</label>
        </div>
      </form>
      <div className="text-center fs-6">
        Don't have an account? &nbsp;
        <a href="/register">Sign up</a>
      </div>
      <div
        className="text-center"
        style={{ color: "gray", fontSize: "14px", margintop: "5px" }}
      >
        Developed by <br /> Ammar Ibrahim
      </div>
    </div>
    // </div>
  );
};

export default Login;
