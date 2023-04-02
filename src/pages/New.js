import { useEffect } from "react";
import DiaryEditor from "../components/DiaryEditor";

const New = ({ Cursor }) => {
  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `소소일기 - 새 일기`;
  });

  return (
    <div>
      <Cursor />
      <DiaryEditor />
    </div>
  );
};

export default New;
