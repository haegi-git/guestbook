import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../";
import Create from "../Components/Create";
import { resetInput } from "../store";

const New = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // store에서 유저의 정보를 가져옴 이 유저의 정보는 글 작성했을 때
  // 데이터베이스에 저장할 유저의 이름 uid 프로필사진을 넣어야해서 가져와야함.
  const user = useSelector((state) => state.userData);
  // store에서 Create에서 사용할 input값을 가져옴 그 input의 value로 데이터베이스에
  // 보내주어서 글 작성을 함
  const createInput = useSelector((state) => state.createInput);
  // postImg에는 유저가 이미지를 올릴 때 그 이미지를 담아둘 공간임
  const [postImg, setPostImg] = useState();
  // postImgDataGet은 props로 Create에 전송해줄 함수인데 유저가 업로드하려는
  // 파일을 가져올 onChange이벤트로 쓸 함수임 PostImg에 이미지파일을 넣어줌
  const postImgDataGet = (e) => {
    setPostImg(e.target.files[0]);
  };
  // addPost는 글 작성 버튼을 눌렀을 때 글을 작성해줄 함수임
  // 원래는 Create.js에서 만들었지만 수정하기버튼을위해 여기서 따로 만들어서
  // props로 전송해줄 예정임
  const addPost = (e) => {
    // 스토리지에 이미지를 올리기위한 코드
    const storageRef = storage.ref();
    if (postImg) {
      // 유저가 이미지를 올릴수도 안올릴수도 있어서 유저가 이미지를 올렸을 경우
      // 이미지를 올려주는 함수들도 함께 작동함
      const storagePath = storageRef.child("image/" + postImg.name);
      const uploadPost = storagePath.put(postImg);
      uploadPost.on(
        "state_changed",
        null,
        (error) => {
          // 업로드에 실패 했을 때
          console.error("업로드 실패", error);
        },
        () => {
          // 업로드에 성공 했을 때
          uploadPost.snapshot.ref.getDownloadURL().then((url) => {
            const dbPostData = {
              // 데이터베이스에 보내줄 데이터들을 모아놓은 변수
              title: createInput.createTitle,
              content: createInput.createContent,
              img: url,
              userName: user.userName,
              userUid: user.userUid,
              userPhoto: user.userPhoto,
              date: new Date(),
            };
            db.collection("guest").add(dbPostData);
            // 이제 업로드에 성공을 했으니 input의 value값을 저장하고있던
            // store에 createInput을 초기화해줘야함
            dispatch(resetInput({ createTitle: "", createContent: "" }));
            navigate("/");
          });
        }
      );
    } else {
      // 유저가 만약 이미지없이 글을 작성 할 수도 있으니 if문으로
      // 없을때 url을 뺀 데이터를 보내줘야 함
      const dbPostDataNoImg = {
        title: createInput.createTitle,
        content: createInput.createContent,
        userName: user.userName,
        userUid: user.userUid,
        userPhoto: user.userPhoto,
        date: new Date(),
      };
      db.collection("guest").add(dbPostDataNoImg);
      // 이미지가없을때도 store에 input을 초기화해줘야함
      dispatch(resetInput({ createTitle: "", createContent: "" }));
      navigate("/");
    }
  };
  return (
    <>
      {/* Create에 props로 전송해줄 녀석들은
    onChange에 유저가 이미지올린 파일을 가져올 녀석과
    btnClick에 글작성하기 누르면 글 작성해줄 함수 그리고
    btnText에 버튼에 들어갈 글자 */}
      <Create
        onChange={postImgDataGet}
        btnText="글 작성하기"
        btnClick={addPost}
      />
    </>
  );
};

export default New;
