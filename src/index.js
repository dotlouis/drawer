import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSpring, animated, config } from "react-spring";

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
  const [{ draw }, setSpring] = useSpring({
    draw: 0,
    config: config.default
  });

  let opened = false;
  let isOpening = false;
  let initialPos = 0;
  let TRESHOLD = 50;
  let OPEN_POS = 300;
  let CLOSE_POS = 0;

  function handleGestureTake({ pageX }) {
    window.addEventListener("mousemove", handleGestureMove);
    window.addEventListener("mouseup", handleGestureRelease);
    console.log(`InitialPos: ${pageX}`);
    initialPos = pageX;
  }
  function handleGestureMove({ pageX }) {
    const delta = pageX - initialPos;
    let from, to;
    console.log("opened: ", opened);

    if (!opened) {
      from = CLOSE_POS;
      to = delta;
      if (delta > TRESHOLD) {
        isOpening = true;
      }
    } else {
      from = OPEN_POS;
      to = OPEN_POS + delta;
      if (delta < -TRESHOLD) {
        isOpening = false;
      }
    }

    setSpring({ from: { draw: from }, to: { draw: to } });
  }
  function handleGestureRelease() {
    window.removeEventListener("mousemove", handleGestureMove);
    window.removeEventListener("mouseup", handleGestureRelease);
    opened = isOpening;
    setSpring({ to: { draw: opened ? OPEN_POS : CLOSE_POS } });
  }

  return (
    <div>
      <animated.span
        style={{
          display: "inline-block",
          transform: draw.interpolate(d => `translate3d(${d}px, 0, 0)`)
        }}
        onMouseDown={handleGestureTake}
      >
        Hello
      </animated.span>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
