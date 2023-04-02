import React from "react";

const LogOut = () => {
  //let navigate = useNavigate();

  const onLogOutClick = () => {
    sessionStorage.removeItem("user_id");
    localStorage.removeItem("user");
    //navigate("/login");
    window.location.replace("/login");
  };

  return (
    <>
      <button
        onClick={onLogOutClick}
        style={{
          border: "none",
          background: "#333",
          color: "#fff",
          // marginLeft: "10px",
          padding: "5px 10px",
          borderRadius: "3px",
          // float: "right",
        }}
      >
        로그아웃
      </button>
    </>
  );
};

export default LogOut;
