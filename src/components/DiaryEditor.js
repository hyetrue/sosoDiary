import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
/* Firebase - imageUpload */
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import MyHeader from "./MyHeader";
import MyButton from "./MyButton";
import IconItem from "./IconItem";
import { DiaryDispatchContext } from "../App";
import { getStringDate } from "../util/date";
import { iconList } from "../util/icon";
import { GrDuplicate } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid"; // 랜덤 식별자를 생성해주는 라이브러리
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { clear } from "@testing-library/user-event/dist/clear";

const DiaryEditor = ({ isEdit, originData }) => {
  const [data, setData] = useState();
  const contentRef = useRef();
  const [content, setContent] = useState("");
  const [per, setPerc] = useState(null);
  // 파일 저장 배열
  const [files, setFiles] = useState([]);
  const [icon, setIcon] = useState(parseInt(id));
  const [date, setDate] = useState(getStringDate(new Date()));
  //닉네임
  const [userName, setUserName] = useState();
  const session = window.sessionStorage;

  const fnc = (async () => {
    const docRef = doc(db, "users", session.getItem("user_id"));
    const docSnap = await getDoc(docRef);
    setUserName(docSnap.data().displayName);
  })();

  const { id } = useParams();
  const { onCreate, onEdit, onRemove } = useContext(DiaryDispatchContext);
  const handleClickIcon = useCallback((icon) => {
    setIcon(icon);
  }, []);
  // console.log(icon);

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (content.length < 1) {
      contentRef.current.focus();
      return;
    }
    if (
      window.confirm(
        isEdit ? "일기를 수정하시겠습니까?" : "새로운 일기를 작성하시겠습니까?"
      )
    ) {
      if (!isEdit) {
        onCreate(
          date,
          content,
          files,
          icon,
          window.sessionStorage.getItem("user_id")
        );
      } else {
        onEdit(
          originData.id,
          date,
          content,
          files,
          icon,
          window.sessionStorage.getItem("user_id")
        );
      }
    }
    navigate("/mypage", { replace: true });
  };

  const handleRemove = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onRemove(originData.id);
      navigate("/mypage", { replace: true });
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setIcon(originData.icon);
      setContent(originData.content);
      setFiles(originData.files);
      window.sessionStorage.getItem("user_id");
    }
  }, [isEdit, originData]);

  const storage = getStorage();

  // 등록된 파일 삭제
  const onDelete = () => {
    const desertRef = ref(storage, files[0]);

    deleteObject(desertRef)
      .then(() => {
        files.length = 0;
        alert("삭제완료");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="contents">
      <MyHeader
        headText={isEdit ? "일기 수정" : `${userName}의 오늘 일기`}
        leftChild={<MyButton text={"<"} onClick={() => navigate(-1)} />}
        rightChild={
          isEdit && (
            <MyButton text={"삭제"} type={"negative"} onClick={handleRemove} />
          )
        }
      />
      <div className="DiaryEditor">
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input
              className="input_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
            />
          </div>
        </section>
        <section>
          <h4>오늘의 이야기는</h4>
          <div className="input_box icon_list_wrapper">
            {iconList.map((it) => (
              <IconItem
                key={it.icon_id}
                {...it}
                onClick={handleClickIcon}
                isSelected={it.icon_id === icon}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘은</h4>
          <div className="input_box text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요?"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <h4>나의 그림</h4>
          <div className="diary_file_wrapper">
            <div className="formInput">
              <label
                htmlFor="file"
                style={{ position: "absolute", marginLeft: "20px" }}
              >
                <GrDuplicate className="icon" style={{ scale: "2" }} />
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFiles(e.target.files[0])}
                style={{ display: "none" }}
              />
              <div className="art_item">
                <img src={""} className="art_img" />
              </div>
            </div>
          </div>
          <button onClick={onDelete}>삭제</button>
        </section>

        <section>
          <div className="control_box">
            <MyButton
              text={"취소"}
              type={"negative"}
              onClick={() => navigate(-1)}
            />
            <MyButton
              text={"작성완료"}
              type={"positive"}
              onClick={handleSubmit}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DiaryEditor;
