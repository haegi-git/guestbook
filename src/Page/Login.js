import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../index";

const Login = () => {
  // 로그인 실패시 실패 글씨 띄우기위함
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  // 로그인의 인풋
  const [loginState, setLoginState] = useState({
    loginEmail: "",
    loginPassword: "",
  });
  const handelLoginState = (e) => {
    setLoginState({
      ...loginState,
      [e.target.name]: e.target.value,
    });
  };

  // 버튼을 눌렀을 때 로그인 시켜줄 함수
  const loginBtn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        loginState.loginEmail,
        loginState.loginPassword
      )
      .then((res) => {
        // 로그인 성공했을 때 메인화면으로 보내주기
        navigate("/", { replace: true });
      })
      .catch(() => {
        setLoginError(true);
      });
  };
  return (
    <div className="Login">
      <form>
        <label htmlFor="loginEmail">이메일</label>
        <input
          value={loginState.loginEmail}
          onChange={handelLoginState}
          name="loginEmail"
          type="email"
          id="loginEmail"
        />
        <label htmlFor="loginPassword">비밀번호</label>
        <input
          value={loginState.loginPassword}
          onChange={handelLoginState}
          name="loginPassword"
          type="password"
          id="loginPassword"
        />
        <p className={`LoginError_${loginError}`}>
          존재하지 않는 아이디거나 잘못 입력하셨습니다.
        </p>
        <button onClick={loginBtn}>로그인</button>
      </form>
      <Link to="/join">회원가입</Link>
    </div>
  );
};
export default Login;
