import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../index";
import { getUserData, removeUserData } from "../store";

const Header = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userData);
  const logout = () => {
    auth.signOut();
    // 로그아웃 했을 때 헤더부분이 실시간으로 변경될 수 있게끔
    // 데이터를 가져와서 박아주는 store도 비워주기
    dispatch(
      removeUserData({
        userName: "",
        userUid: "",
        userPhoto: "",
      })
    );
    navigate("/", { replace: true });
  };
  useEffect(() => {
    // 마운트됐을 때 한번만 불러주기위해서 useEffect에 넣었음
    auth.onAuthStateChanged((user) => {
      // 유저가 로그인되어있는 상태라면 user의정보를 불러옴
      if (user) {
        // 유저가 로그인한 상태일 때 유저의 정보를 불러올 곳
        // 유저가 로그인된상태일때 로컬스토리지에서 정보를 저장함과 동시에
        // store에 user정보를 필요한 이름과 uid 프로필사진의url을 저장해줌
        localStorage.setItem("user", JSON.stringify(user));
        const postStoreUser = {
          userName: user.displayName,
          userUid: user.uid,
          userPhoto: user.photoURL,
        };
        dispatch(getUserData(postStoreUser));
      } else {
        // 유저가 로그인된 상태가 아닐때 로컬스토리지를 비워줌
        localStorage.clear();
      }
    });
  }, []);

  return (
    <div className="Header">
      <Link to="/">GuestBook</Link>

      {/* 유저가 로그인하면 유저정보에 유저가 들어감 그걸로 확인 */}
      {user.userUid.length <= 2 ? (
        <Link to="/login">Login</Link>
      ) : (
        <div
          onClick={() => {
            props.userMenuChange();
          }}
          className="Header_userinfo"
        >
          <img src={user.userPhoto} alt="유저 프로필 사진" />
          <span>{user.userName}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      )}

      <ul className={`Header_userMenu_${props.userMenu}`}>
        <li>
          <Link to="/mypage">마이페이지</Link>
        </li>
        <li onClick={logout}>로그아웃</li>
      </ul>
    </div>
  );
};
export default Header;
