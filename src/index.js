import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSpring, animated, config } from 'react-spring';

import './styles.css';

function App() {
  const [draw, setDraw] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setDraw(!draw)}>
        {draw ? 'Close' : 'Open'} Drawer
      </button>
      <div className="viewport">
        <Drawer opened={draw} onDraw={opened => setDraw(opened)}>
          A good drawer is actionnable through movement and toggle actions
        </Drawer>
        <div className="content">
          <p>
            This is a demo of the useSpring() hook to make a drawer with
            gestures
          </p>
        </div>
      </div>
    </div>
  );
}

function Drawer({
  opened = false,
  onDraw = () =>
    console.warn(
      `The drawer won't toggle if you don't change state in the onDraw() prop callback`
    ),
  ...props
}) {
  // all units in px
  let HITBOX_SIZE = 15;
  let DRAWER_SIZE = 320;
  let BASCULE = 50;

  let _opened = opened;
  let initialPos = 0;
  let OPEN_POS = DRAWER_SIZE;
  let CLOSE_POS = 0;

  const [{ draw }, setSpring] = useSpring({
    draw: 0,
    config: config.default
  });
  setSpring({ to: { draw: opened ? OPEN_POS : CLOSE_POS } });

  function handleGestureTake({ pageX }) {
    window.addEventListener('mousemove', handleGestureMove);
    window.addEventListener('touchmove', handleGestureMove);
    window.addEventListener('mouseup', handleGestureRelease);
    window.addEventListener('touchend', handleGestureRelease);
    initialPos = pageX;
  }
  function handleGestureMove({ pageX }) {
    const delta = pageX - initialPos;
    let from, to;

    if (!opened) {
      from = CLOSE_POS;
      to = delta;
      _opened = delta > BASCULE;
    } else {
      from = OPEN_POS;
      to = OPEN_POS + delta;
      _opened = delta > -BASCULE;
    }

    setSpring({ from: { draw: from }, to: { draw: to } });
  }
  function handleGestureRelease() {
    window.removeEventListener('mousemove', handleGestureMove);
    window.removeEventListener('touchmove', handleGestureMove);
    window.removeEventListener('mouseup', handleGestureRelease);
    window.removeEventListener('touchend', handleGestureRelease);
    onDraw(_opened);
  }

  return (
    <animated.nav
      style={{
        transform: draw.interpolate(
          d =>
            `translate3d(${
              d < CLOSE_POS ? CLOSE_POS : d > OPEN_POS ? OPEN_POS : d
            }px, 0, 0)`
        )
      }}
      onMouseDown={handleGestureTake}
      onTouchStart={handleGestureTake}
    >
      <div className="nav-content">{props.children}</div>
    </animated.nav>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
