import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../index";
import { setCreateInput } from "../store";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //   id값이 같은 아이템만 뽑아서 담아둘 state
  const [detailData, setDetailData] = useState();
  const user = useSelector((state) => state.userData);
  useEffect(() => {
    // URL에 있는 id와 데이터베이스에 있는 데이터중 같은 id를 찾아내서 뽑아줄 코드
    db.collection("guest").onSnapshot((res) => {
      const findData = res.docs.find((ele) => ele.id === id);

      //   데이터베이스에서 날짜 데이트를 가져올 때 사용할 수 있게끔 바로
      // 변환해주는 작업 원래는 new Date()여서 2347928347892347 이러한 숫자가 들어가있는데
      //   그곳에서 월 과 일 month/date만 뽑아와서 사용해줬음
      const toDate = findData.data().date.toDate();
      const detailDate = `${toDate.getMonth() + 1}/${toDate.getDate()}`;
      console.log(detailDate);
      setDetailData({
        id: findData.id,
        ...findData.data(),
        date: detailDate,
      });
    });
  }, []);

  const modifyBtn = () => {
    dispatch(
      setCreateInput({
        createTitle: detailData.title,
        createContent: detailData.content,
      })
    );
    navigate(`/detail/edit/${detailData.id}`);
  };

  const deleteBtn = () => {
    db.collection("guest").doc(id).delete();
    navigate("/", { replace: true });
  };
  if (detailData) {
    return (
      <div className="Detail">
        <h1>{detailData.title}</h1>
        {detailData.img === undefined ? null : (
          <img src={detailData.img} alt="상세페이지 이미지" />
        )}
        <p>{detailData.content}</p>
        <div className="Detail_info">
          <div className="Detail_info_user">
            <img src={detailData.userPhoto} alt="유저이미지" />
            <span>{detailData.userName}</span>
          </div>

          <span>{detailData.date}</span>
        </div>
        {detailData.userUid === user.userUid ? (
          <div className="Detail_btn">
            <button onClick={modifyBtn}>수정하기</button>
            <button onClick={deleteBtn}>삭제하기</button>
          </div>
        ) : null}
      </div>
    );
  }
};

export default Detail;
