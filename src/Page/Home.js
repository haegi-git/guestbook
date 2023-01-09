import { memo, useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ListItem from "../Components/ListItem.js";
import { db } from "../index.js";
import { resetInput } from "../store.js";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 이곳에 모든 데이터가 들어갑니다.
  const [data, setData] = useState([]);

  const user = useSelector((state) => state.userData);

  useEffect(() => {
    // 이곳에서 파이어베이스의 데이터베이스에서 모든 데이터를 가져옵니다.
    db.collection("guest").onSnapshot((res) => {
      // resGetArr이라는 변수에 모든 데이터를 담아주고
      const resGetArr = res.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // 여기서 정렬해주는 sort기능은 글이 최신순이 가장 앞으로 나올 수 있게 만들어줌
      resGetArr.sort((a, b) => b.date - a.date);
      // setData로 data라는 State에 저장을시켜줍니다.
      setData(resGetArr);
    });
  }, []);

  // 여기는 페이지네이션 라이브러리를 관리해줄 곳
  const [page, setPage] = useState(1);
  const [items, setItems] = useState(6);
  const handelPage = (page) => {
    setPage(page);
  };

  // 글 작성 버튼 함수
  const addTextBtn = () => {
    if (user.userUid.length >= 2) {
      dispatch(
        resetInput({
          createTitle: "",
          createContent: "",
        })
      );
      navigate("/new");
    } else {
      alert("로그인을 해주세요.");
    }
  };

  const [sort, setSort] = useState("latest");
  const listSort = () => {
    if (sort === "latest") {
      data.sort((a, b) => a.date - b.date);
    } else if (sort === "old") {
      data.sort((a, b) => b.date - a.date);
    }
  };

  return (
    <div className="Home">
      <div className="Home_Header">
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            listSort();
          }}
        >
          <option value="latest">최신순</option>
          <option value="old">오래된순</option>
        </select>

        <h2>글목록</h2>

        <button onClick={addTextBtn}>글작성</button>
      </div>

      <div className="Home_contents">
        {/* map함수 돌릴 때 페이지네이션의 아이템갯수만큼 보여주어야하기때문에
        slice를 사용해주어야함 어떻게 작동하는지는 아직 잘 모르겠음,, */}
        {data
          .slice(items * (page - 1), items * (page - 1) + items)
          .map((a, i) => {
            return (
              <Link to={`/detail/${a.id}`} key={i}>
                <ListItem data={a} />
              </Link>
            );
          })}
      </div>
      <Pagination
        // activePage는 현재 보고 있는 페이지
        activePage={page}
        // itemsCountPerPage 한 화면에 보여줄 아이템의 갯수임
        itemsCountPerPage={6}
        // 내가 가져온 데이터의 갯수를 넣었음
        // totalItemsCount 내가 가져온 데이터의 총 갯수를 넣어줄 곳 표시할 아이템의
        // 전체 갯수를 뜻함
        totalItemsCount={data.length}
        pageRangeDisplayed={5}
        onChange={handelPage}
      ></Pagination>
    </div>
  );
};
export default memo(Home);
