import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSpring, animated } from "react-spring";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <Drawer />
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}

function Drawer() {
  const { draw, ...gestures } = useGestures();
  //const [spring] = useSpring({ transform: `translate3d(${draw}px, 0, 0)` });

  console.log("DRAW: ", draw);

  return <animated.div {...gestures}>Hello</animated.div>;
}

function useGestures() {
  const [draw, setDraw] = useState(0);
  const [taken, setTaken] = useState(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleGestureMove);
    window.addEventListener("mouseup", handleGestureRelease);

    return () => {
      window.removeEventListener("mousemove", handleGestureMove);
      window.removeEventListener("mouseup", handleGestureRelease);
    };
  });

  function handleGestureTake({ pageX }) {
    setTaken(true);
  }
  function handleGestureMove({ pageX }) {
    if (taken) {
      setDraw(pageX);
    }
  }
  function handleGestureRelease({ pageX }) {
    setTaken(false);
  }

  return {
    draw,
    onMouseDown: handleGestureTake
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
