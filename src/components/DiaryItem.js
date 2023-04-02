import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";
import React from "react";

const DiaryItem = ({ id, icon, content, files, date }) => {
  const navigate = useNavigate();

  const env = process.env;
  env.PUBLIC_URL = env.PUBLIC_URL || "";

  const srtDate = new Date(parseInt(date)).toLocaleDateString();

  const goDetail = () => {
    navigate(`/diary/${id}`);
  };

  const goEdit = () => {
    navigate(`/edit/${id}`);
  };

  return (
    <div className="DiaryItem">
      <div
        onClick={goDetail}
        className={["icon_img_wrapper", `icon_img_wrapper_${icon}`].join(" ")}
      >
        <img src={process.env.PUBLIC_URL + `assets/icon${icon}.png`} />
      </div>
      <div onClick={goDetail} className="info_wrapper">
        <div className="diary_date">{srtDate}</div>
        <div className="diary_content_preview">{content.slice(0, 25)}</div>
        {/* <div>
        <img src={files[0]} width="10%" />
        </div> */}
      </div>
      <div className="btn_wrapper">
        <MyButton onClick={goEdit} text={"수정"} />
      </div>
    </div>
  );
};

export default React.memo(DiaryItem);
