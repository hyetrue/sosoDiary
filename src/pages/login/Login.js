import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import loginTop from "./../images/login_top.png";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });

        let session = window.sessionStorage;
        session.setItem("user_id", email);

        navigate("/");
      })
      .catch((error) => {
        setError(true);
      });
  };

  const joinLoad = () => {
    <Link to="/join" />;
  };

  return (
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>소소일기 로그인</h1>
        </div>
        <div className="bottom">
          <img src={loginTop} style={{ width: "100%", marginTop: "30px" }} />
          <p
            style={{
              textAlign: "center",
              fontWeight: "100",
              fontSize: "14px",
              letterSpacing: "0.2em",
              fontFamily: "SCDream3",
              marginTop: "10px",
            }}
          >
            소소한 일상을 기록해 보세요.
          </p>
          <div className="left"></div>

          <div className="right">
            <form onSubmit={handleLogin}>
              <div className="formInput">
                <input
                  type="email"
                  placeholder="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="formInput">
                <input
                  type="password"
                  placeholder="password"
                  autoComplete="on"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="login_btn">
                <button type="submit" style={{ background: "#f8c70f" }}>
                  로그인
                </button>

                <Link to="/join" className="link">
                  {" "}
                  회원가입{" "}
                </Link>
              </div>

              <br />
              {error && <span>이메일 또는 비밀번호가 다시 확인해주세요.</span>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
