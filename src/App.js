import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import Detail from "./Page/Detail";
import Edit from "./Page/Edit";
import ErrorPage from "./Page/ErrorPage";
import Home from "./Page/Home";
import Join from "./Page/Join";
import Login from "./Page/Login";
import MyPage from "./Page/MyPage";
import New from "./Page/New";

function App() {
  const [userMenu, setUserMenu] = useState(false);
  const userMenuChange = () => {
    setUserMenu(!userMenu);
  };
  const userMenuTrue = () => {
    if (userMenu === true) {
      setUserMenu(false);
    }
  };
  return (
    <BrowserRouter>
      <div className="App" onClick={userMenuTrue}>
        <Header userMenu={userMenu} userMenuChange={userMenuChange} />

        <Routes>
          <Route path="/" element={<Home />} />
          {/* 로그인페이지 */}
          <Route path="/login" element={<Login />} />
          {/* 회원가입페이지 */}
          <Route path="/join" element={<Join />} />
          {/* 글작성페이지 */}
          <Route path="/new" element={<New />} />
          {/* 상세페이지 */}
          <Route path="/detail/:id" element={<Detail />} />
          {/* 상세페이지 수정할 페이지 */}
          <Route path="/detail/edit/:id" element={<Edit />} />

          <Route path="/mypage" element={<MyPage />} />

          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
