import { useRef } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import backend from "../../Backend";

const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const repeatPassword = useRef();

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    if (repeatPassword.current.value !== password.current.value) {
      password.current.setCustomValidity("Passwords Don't Match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await backend.post("/auth/register", user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft">
            <h3 className="loginLogo">Utsar Social</h3>
            <span className="loginDescription">
              Connect with friends around the world on Utsar Social
            </span>
          </div>
          <div className="loginRight">
            <form className="loginBox" onSubmit={handleClick}>
              <input
                placeholder="Username"
                required
                ref={username}
                className="loginInput"
              />
              <input
                placeholder="Email"
                type="email"
                required
                ref={email}
                className="loginInput"
              />
              <input
                placeholder="Password"
                type="password"
                required
                minLength="6"
                ref={password}
                className="loginInput"
              />
              <input
                placeholder="Repeat Password"
                type="password"
                required
                ref={repeatPassword}
                className="loginInput"
              />
              <button className="loginButton" type="submit">
                Sign Up
              </button>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignSelf: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <button className="loginRegister">Log into Account</button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
