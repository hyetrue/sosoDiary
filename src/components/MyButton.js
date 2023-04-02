import { Button } from "react-bootstrap";

const MyButton = ({ text, type, onClick }) => {
  const btnType = ["positive", "positive", "negative"].includes(type)
    ? type
    : "default";

  return (
    <button
      className={["MyButton", `MyButton_${btnType}`].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

MyButton.defaultProps = {
  type: "default",
};

export default MyButton;
