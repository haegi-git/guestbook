import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faBlog, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const Footer = () => {
  const [adminPost, setAdminPost] = useState(false);
  return (
    <footer className="Footer">
      <a href="https://github.com/haegi-git">
        <FontAwesomeIcon className="Footer_icon" icon={faGithub} />
      </a>
      <a href="https://velog.io/@chemi163">
        <FontAwesomeIcon className="Footer_icon" icon={faBlog} />
      </a>
      <FontAwesomeIcon
        className="Footer_icon"
        icon={faPaperPlane}
        onClick={() => {
          setAdminPost(!adminPost);
        }}
      />
      <div className={`adminPost adminPost_${adminPost}`}>
        <h1>주인장 이메일</h1>
        <h3>b_haegi@naver.com</h3>
        <h4>버그찾으시면 메일주세요. 감사합니다.</h4>
        <p>부족하지만 열심히 만들었습니다.</p>
        <button
          onClick={() => {
            setAdminPost(!adminPost);
          }}
        >
          닫기
        </button>
      </div>
    </footer>
  );
};
export default Footer;
