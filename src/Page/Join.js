import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../index";
import { getUserData, removeUserData } from "../store";

const Join = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 유저의 기본 이미지를 담아둘 state
  const [defaultPhoto, setDefaultPhoto] = useState();
  // 유저가 비밀번호 6자리이하 입력했을 때 에러띄워줄거
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    db.collection("default").onSnapshot((res) => {
      // console.log(res.docs[0].data().userPhotoPreview); 이미지 경로가 데이터베이스에
      // 제대로 뽑아와지는지 확인한 콘솔띄우기
      const getDefaultPhoto = res.docs[0].data().userPhoto;
      setDefaultPhoto(getDefaultPhoto);
    });
  });
  //   유저가 이미지를 올렸을 시 미리보기를 담아둘곳
  const [userPhotoPreview, setUserPhotoPreview] = useState();
  //   유저가 이미지를 업로드했을 때 미리보기 띄워주는 함수
  const previewPhoto = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const getUserPhotoPreviewFile = e.target.files[0];
    reader.onloadend = () => {
      setUserPhotoPreview(reader.result);
    };
    reader.readAsDataURL(getUserPhotoPreviewFile);
  };

  //   input의 value값을 관리해줄 state
  const [joinState, setJoinState] = useState({
    joinEmail: "",
    joinPassword: "",
    joinName: "",
  });
  //   joinState를 변경시키고 그 변경된 값을 joinState로 다시 보내주기위한 함수
  const handelJoinState = (e) => {
    e.preventDefault();
    setJoinState({
      ...joinState,
      [e.target.name]: e.target.value,
    });
  };

  //  회원가입 시켜줄 함수
  // 회원가입에 사용할 유저가 올린 이미지파일을 받아올 state
  const [userPhoto, setUserPhoto] = useState();
  const joinBtn = (e) => {
    // 모든 함수에 e.preventDefault를 붙여준건 form태그안에 input들이 작성이되어있어서
    // 새로고침 이벤트가 기본적으로 발생하기에 그걸 막아줌
    e.preventDefault();
    // auth는 회원, 사용자 관련의 함수인듯하다. 아래의 코드는 이메일과 비밀번호를 받아와
    // 회원가입을 시켜주는 함수이다.
    auth
      .createUserWithEmailAndPassword(
        joinState.joinEmail,
        joinState.joinPassword
      )
      .then((res) => {
        // 이 변수는 유저의 이메일과 이름을 저장해둔 다음 데이터베이스에 넣기위함
        // 데이터베이스에 유저의 uid를 넣어주어야하기때문이다.

        // 회원가입이 성공했을 때 코드ㄴ
        // 회원가입이 정상적으로 됐을 때 유저의 이름과 프로필이미지 또한 업로드해주어야함.

        // 업로드는 일단 이미지부터 업로드를 마쳐준 뒤 유저의 정보를 넣어야한다.
        // 무거운 순이랬던거같음.
        const storageRef = storage.ref();
        // 그리고 유저가 항상 프로필사진을 넣는건 아니기때문에 조건문으로 만들어주어야한다.
        // 프로필사진을 넣지않았다면 유저의 프로필사진은 기본사진을 넣어줄것이다.
        // 조건문으로 확인해 줄 것은 유저가 업로드 할 이미지가 있는지를 체크하면된다.
        // 유저가 업로드 할 이미지를 받아올 곳은 userPhoto

        if (userPhoto) {
          // 유저가 이미지를 올렸을 때
          const storagePath = storageRef.child(
            "profile/" + `${joinState.joinName + userPhoto.name}`
          );
          const uplodaPhoto = storagePath.put(userPhoto);
          uplodaPhoto.on(
            // 이곳은 이미지업로드가 진행중일 때
            "state_changed",
            null,
            (error) => {
              // 이곳은 이미지업로드가 무슨이유에서 실패할 경우
              console.error("실패", error);
            },
            () => {
              // 이곳은 이미지 업로드가 성공했을 때 유저의 이름과 유저의 프로필사진의경로를
              // 데이터베이스에 저장하기위해 데이터베이스 user라는 곳에 저장할것
              uplodaPhoto.snapshot.ref.getDownloadURL().then((url) => {
                // 성공했을 때 url에는 이미지의 경로값이 들어있다.
                console.log("이미지가 업로드된 경로", url);
                res.user
                  .updateProfile({
                    displayName: joinState.joinName,
                    photoURL: url,
                    // 유저의 이름과 유저의 이미지경로를 user 데이터에 저장함
                  })
                  .then(() => {
                    // 이곳은 유저의 이름과 유저 이미지경로를 user데이터에 성공적으로
                    // 저장했을 경우에 store에있는 userData에도 데이터를 보내주는역할
                    // 그래야 헤더의 유저정보가 제대로 실시간반영이된다.
                    dispatch(
                      getUserData({
                        userName: joinState.joinName,
                        userPhoto: url,
                        userUid: res.user.uid,
                      })
                    );
                  });
                const userData = {
                  userEmail: joinState.joinEmail,
                  userName: joinState.joinName,
                  userPhoto: url,
                };

                // 유저의 아이디와 이름과 uid를 데이터베이스에 저장해주는 역할
                db.collection("user").doc(res.user.uid).set(userData);
              });
              navigate("/");
            }
          );
        } else {
          // 이곳은 유저가 프로필사진을 지정하지 않았을 때 기본이미지로 설정해줄 예정
          res.user
            .updateProfile({
              displayName: joinState.joinName,
              photoURL: defaultPhoto,
              // 유저의 이름을 넣어주고 유저의 사진은 기본사진으로 넣어준다.
            })
            .then(() => {
              // 이곳도 유저의 이름과 이미지가 정상적으로 user정보에 들어가게되면
              // store에 있는 userData에 이름과  포토 uid를 넣어주는곳
              dispatch(
                getUserData({
                  userName: joinState.joinName,
                  userPhoto: defaultPhoto,
                  userUid: res.user.uid,
                })
              );
            });
          const userData = {
            userEmail: joinState.joinEmail,
            userName: joinState.joinName,
            userPhoto: defaultPhoto,
          };

          db.collection("user").doc(res.user.uid).set(userData);
          navigate("/");
        }
      })
      .catch(() => {
        setPasswordError(true);
      });
  };

  return (
    <div className="Join">
      <h1>회원가입페이지</h1>
      <form className="join_Form">
        <img
          className="joinPhoto"
          src={userPhotoPreview === undefined ? defaultPhoto : userPhotoPreview}
          alt="유저 프로필 이미지"
        />
        <label htmlFor="joinPhoto">프로필 사진 선택</label>
        <input
          onChange={(e) => {
            previewPhoto(e);
            setUserPhoto(e.target.files[0]);
            // 유저가 프로필사진으로 지정하려는 파일의 정보를 가져오기
          }}
          id="joinPhoto"
          type="file"
          style={{ display: "none" }}
        />
        <label htmlFor="joinEmail">이메일</label>
        <input
          value={joinState.joinEmail}
          onChange={handelJoinState}
          name="joinEmail"
          id="joinEmail"
          type="email"
          placeholder="이메일을 입력해주세요."
        />
        <label htmlFor="joinPassword">비밀번호</label>
        <input
          value={joinState.joinPassword}
          onChange={handelJoinState}
          name="joinPassword"
          id="joinPassword"
          type="password"
          placeholder="비밀번호는 6자리 이상"
        />
        <p className={`JoinError_${passwordError}`}>
          비밀번호는 6자리 이상 해주어야합니다.
        </p>
        <label htmlFor="joinName">이름 또는 닉네임</label>
        <input
          maxLength={4}
          value={joinState.joinName}
          onChange={handelJoinState}
          name="joinName"
          id="joinName"
          type="text"
          placeholder="이름 또는 닉네임 0~4글자"
        />

        <button onClick={joinBtn}>회원가입</button>
      </form>
    </div>
  );
};

export default Join;
