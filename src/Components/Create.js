import { useDispatch, useSelector } from "react-redux";
import { setCreateInput } from "../store";
import React, { memo } from "react";

const Create = (props) => {
  const dispatch = useDispatch();
  const createInput = useSelector((state) => state.createInput);

  const handelCreateInput = (e) => {
    dispatch(
      setCreateInput({
        ...createInput,
        [e.target.name]: e.target.value,
      })
    );
  };
  return (
    <div className="Create">
      <input
        value={createInput.createTitle}
        onChange={handelCreateInput}
        name="createTitle"
        type="text"
        placeholder="제목을 입력하세요."
        maxLength={10}
      />
      <textarea
        value={createInput.createContent}
        onChange={handelCreateInput}
        name="createContent"
        type="text"
        placeholder="내용을 입력하세요."
      />
      <label htmlFor="createImg">이미지 올리기</label>
      <input
        onChange={props.onChange}
        id="createImg"
        type="file"
        style={{ display: "none" }}
      />
      <button onClick={props.btnClick}>{props.btnText}</button>
    </div>
  );
};
export default memo(Create);
