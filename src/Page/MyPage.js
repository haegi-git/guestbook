import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, storage } from "../index";
import { getUserData } from "../store";

const MyPage = () => {
  // 프로필 변경될 때 dispatch로 리덕스툴킷에도 변경해줘야 헤더메뉴가 실시간으로 변경될듯
  const dispatch = useDispatch();
  // store에서 유저정보 가져올 곳 이름과 사진
  const user = useSelector((state) => state.userData);
  // 변경할 이미지 스토리지에 넣어줄 파일 담아둘 곳
  const [changeImg, setChangeImg] = useState();
  // 변경할 이미지를 미리보여줄 이미지를 담아둘 곳
  const [changeSetImg, setChangeSetImg] = useState();

  const [changeInput, setChangeInput] = useState("");

  //   유저가 변경할 이미지를 넣었을때 미리 보여주는 함수
  const changeImgPreview = (e) => {
    const reader = new FileReader();
    const getUserPhotoPreviewFile = e.target.files[0];
    reader.onloadend = () => {
      setChangeSetImg(reader.result);
    };
    reader.readAsDataURL(getUserPhotoPreviewFile);
  };

  console.log(changeInput);

  const changeProfile = () => {
    const storageRef = storage.ref();
    if (changeImg) {
      const storagePath = storageRef.child("profile" + changeImg.name);
      const uploadChange = storagePath.put(changeImg);
      uploadChange.on(
        "state_changed",
        null,
        (error) => {
          console.error("실패", error);
        },
        () => {
          uploadChange.snapshot.ref.getDownloadURL().then((url) => {
            const dbUserUpdate = {
              userName: changeInput,
              userPhoto: url,
            };
            auth.onAuthStateChanged((user) => {
              user.updateProfile({
                displayName: changeInput,
                photoURL: url,
              });
              dispatch(
                getUserData({
                  userName: changeInput,
                  userPhoto: url,
                  userUid: user.uid,
                })
              );
            });

            db.collection("user").doc(user.userUid).update(dbUserUpdate);
          });
        }
      );
    } else {
      const dbUserUpdate = {
        userName: changeInput,
      };
      auth.onAuthStateChanged((user) => {
        user.updateProfile({
          displayName: changeInput,
        });
        dispatch(
          getUserData({
            userName: changeInput,
            userUid: user.uid,
          })
        );
      });

      db.collection("user").doc(user.userUid).update(dbUserUpdate);
    }
  };

  return (
    <div className="MyPage">
      <h1>마이페이지</h1>
      <label>이름 변경</label>
      <input
        value={changeInput}
        onChange={(e) => {
          setChangeInput(e.target.value);
        }}
        className="changeName"
        type="text"
        placeholder="변경하실 이름을 넣어주세요."
      />
      <img
        className="changeImage"
        src={changeImg === undefined ? user.userPhoto : changeSetImg}
        alt="이미지 변경하기"
      />
      <label htmlFor="changeImage">이미지 변경</label>
      <input
        onChange={(e) => {
          changeImgPreview(e);
          setChangeImg(e.target.files[0]);
        }}
        id="changeImage"
        type="file"
        style={{ display: "none" }}
      />
      <button onClick={changeProfile}>변경하기</button>
    </div>
  );
};

export default MyPage;
