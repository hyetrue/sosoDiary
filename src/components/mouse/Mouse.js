import React, { useRef, useEffect, useState, memo } from "react";
import styles from "./Mouse.module.css";

const Mouse = memo((props) => {
  const mouseRef = useRef();

  const [coordinate, setCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const events = () => {
      document.body.addEventListener("mousemove", onMouseMove);
      document.body.addEventListener("mouseenter", onMouseEnter);
      document.body.addEventListener("mouseleave", onMouseLeave);
      document.body.addEventListener("mousedown", onMouseDown);
      document.body.addEventListener("mouseup", onMouseUp);
    };

    const removeEvents = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseenter", onMouseEnter);
      document.body.removeEventListener("mouseleave", onMouseLeave);
      document.body.removeEventListener("mousedown", onMouseDown);
      document.body.removeEventListener("mouseup", onMouseUp);
    };

    events();
    return () => {
      removeEvents();
      setClicked(false);
      setHidden(false);
    };
  }, []);

  const onMouseLeave = () => {
    setHidden(true);
  };

  const onMouseEnter = () => {
    setHidden(false);
  };

  const onMouseMove = (e) => {
    setCoordinate({ x: e.clientX, y: e.clientY });
  };

  const onMouseDown = () => {
    setClicked(true);
  };

  const onMouseUp = () => {
    setClicked(false);
  };

  return (
    <div
      ref={mouseRef}
      style={{
        left: `${coordinate.x}px`,
        top: `${coordinate.y}px`,
      }}
      className={`${styles.cursor} ${!hidden ? styles.show : styles.hide} ${
        clicked ? styles.onClick : styles.offClick
      }`}
    ></div>
  );
});

export default Mouse;
