const ListItem = (props) => {
  const toDate = props.data.date.toDate();
  const listDate = `${toDate.getMonth() + 1}/${toDate.getDate()}`;
  return (
    <div className="Home_listitem">
      {props.data.img === undefined ? null : (
        <img src={props.data.img} alt="이미지" />
      )}
      <h3 className="listTitle">{props.data.title}</h3>
      <p className="listContent">
        {props.data.content.length > 15 ? (
          <>{props.data.content.slice(0, 14) + "..."}</>
        ) : (
          <>{props.data.content}</>
        )}
      </p>
      <div className="Home_listitem_info">
        <div className="Home_listitem_info_user">
          <img src={props.data.userPhoto} alt="유저이미지" />
          <p>{props.data.userName}</p>
        </div>

        <p>{listDate}</p>
      </div>
    </div>
  );
};
export default ListItem;
