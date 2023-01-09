import { db, storage } from "../index";
import Create from "../Components/Create";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editInput = useSelector((state) => state.createInput);

  // 수정할 때 수정하는사람이 이미지를 넣었을 때 그 이미지파일 가져올 곳
  const [editImg, setEditImg] = useState();
  // 수정할 때 이미지파일을 가져올 onChange함수
  const editImgChange = (e) => {
    setEditImg(e.target.files[0]);
  };

  const updateBtn = () => {
    const storageRef = storage.ref();
    if (editImg) {
      const storagePath = storageRef.child("image/" + editImg.name);
      const updateImg = storagePath.put(editImg);
      updateImg.on(
        "state_changed",
        null,
        (error) => {
          console.error("업데이트 실패", error);
        },
        () => {
          // 이미지 업데이트 성공시
          updateImg.snapshot.ref.getDownloadURL().then((url) => {
            const dbUpdateData = {
              title: editInput.createTitle,
              content: editInput.createContent,
              img: url,
            };
            db.collection("guest").doc(id).update(dbUpdateData);
          });
        }
      );
    } else {
      const dbUpdateData = {
        title: editInput.createTitle,
        content: editInput.createContent,
      };
      db.collection("guest").doc(id).update(dbUpdateData);
    }
    navigate("/");
  };

  return (
    <div>
      <Create
        onChange={editImgChange}
        btnClick={updateBtn}
        btnText="수정하기"
      />
    </div>
  );
};

export default Edit;
