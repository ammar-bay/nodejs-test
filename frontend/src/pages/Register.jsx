import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
// import "./Register.scss";

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const FULLNAME_REGEX = /^[a-zA-Z0-9\s]{2,30}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{6,24}$/;
const REGISTER_URL = "/register";

const Register = () => {
  const usernameRef = useRef();
  const fullNameRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [validFullName, setValidFullName] = useState(false);
  const [fullNameFocus, setFullNameFocus] = useState(false);

  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fullNameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidFullName(FULLNAME_REGEX.test(fullName));
  }, [fullName]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [username, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          fullName,
          username,
          pwd,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      // setSuccess(true);
      // //clear state and controlled inputs
      // setFullName("");
      // setUsername("");
      // setPwd("");
      // setMatchPwd("");
      // navigate("/");
    } catch (err) {
      toast.error(err.response?.data.message || "Error Occured");
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Username Taken");
      } else {
        setErrMsg("Registration Failed");
      }
      errRef.current?.focus();
    }
  };

  return (
    <div className="register">
      <div className="wrapper">
        <div className="text-center mt-4 name">Register</div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">
            <FontAwesomeIcon
              icon={faCheck}
              className={validFullName ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validFullName || !fullName ? "hide" : "invalid"}
            />
          </label>
          <div className="form-field d-flex align-items-center">
            <input
              placeholder="Full Name"
              type="text"
              id="fullname"
              ref={fullNameRef}
              autoComplete="off"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setFullNameFocus(true)}
              onBlur={() => setFullNameFocus(false)}
            />
          </div>
          <p
            id="uidnote"
            className={
              fullNameFocus && fullName && !validFullName
                ? "instructions"
                : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            3 to 30 characters.
            <br />
            Must all be letters and don't write Dr. in the beginning
          </p>
          <label htmlFor="username">
            <FontAwesomeIcon
              icon={faCheck}
              className={validName ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validName || !username ? "hide" : "invalid"}
            />
          </label>
          <div className="form-field d-flex align-items-center">
            <input
              placeholder="Username"
              type="text"
              id="username"
              ref={usernameRef}
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
          </div>
          <p
            id="uidnote"
            className={
              userFocus && username && !validName ? "instructions" : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>

          <label htmlFor="password">
            <FontAwesomeIcon
              icon={faCheck}
              className={validPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validPwd || !pwd ? "hide" : "invalid"}
            />
          </label>
          <div className="form-field d-flex align-items-center">
            <input
              placeholder="Password"
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
          </div>
          <p
            id="pwdnote"
            className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>

          <label htmlFor="confirm_pwd">
            <FontAwesomeIcon
              icon={faCheck}
              className={validMatch && matchPwd ? "valid" : "hide"}
            />
            <FontAwesomeIcon
              icon={faTimes}
              className={validMatch || !matchPwd ? "hide" : "invalid"}
            />
          </label>
          <div className="form-field d-flex align-items-center">
            <input
              placeholder="Cofirm Password"
              type="password"
              id="confirm_pwd"
              onChange={(e) => setMatchPwd(e.target.value)}
              value={matchPwd}
              required
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="confirmnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
          </div>
          <p
            id="confirmnote"
            className={matchFocus && !validMatch ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
          <div className="text-center text-red mb-20">{errMsg}</div>
          <button
            className="btn mt-3 "
            disabled={
              !validName || !validPwd || !validMatch || !validFullName
                ? true
                : false
            }
          >
            Sign Up
          </button>
        </form>
        <div className="text-center fs-6 mt-10">
          Already have an account? &nbsp;
          <a href="/register">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
