import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useSpring, animated, config } from 'react-spring';
import { useGestures } from 'react-use-gestures';

import './styles.css';

function App() {
  const [draw, setDraw] = useState(true);

  return (
    <div className="App">
      <button onClick={() => setDraw(!draw)}>
        {draw ? 'Close' : 'Open'} Drawer
      </button>
      <div className="viewport">
        <Drawer
          opened={draw}
          onDraw={opened => setDraw(opened)}
          handleSize={10}
          drawerSize={230}
        >
          <div className="nav-content">
            <p>
              A good drawer is actionnable through movement and toggle actions
            </p>
            <p>
              In <span className="green">green</span> the overlay covers the
              rest of the viewport. You can click on it to close the drawer. Or
              push it with your mouse/touch.
            </p>
          </div>
        </Drawer>
        <div className="content">
          <p>
            This is a demo of the useSpring() hook to make a drawer with
            gestures
          </p>
          <p>
            In <span className="red">red</span> the handle to take and pull the
            drawer
          </p>
          <p>
            The drawer is a fully controlled component. Which means it doesn't
            keep it's state. You should store its state from a parent component
            (or context)
          </p>
          <p>
            It also means you <strong>MUST</strong> implement the onDraw() prop
            by at least seting the drawer state in it.
          </p>
          <pre>{`onDraw={opened => setState(opened)}`}</pre>
          <p>
            If you don't, you will see a warning and the drawer will refuse to
            stay open/close
          </p>
        </div>
      </div>
    </div>
  );
}

function Drawer({
  opened = false,
  onDraw = opened => {
    setSpring({ to: { draw: opened ? CLOSE_POS : OPEN_POS } });
    console.warn(
      `The drawer won't ${
        opened ? 'open' : 'close'
      } if you don't change state in the onDraw() prop callback`,
    );
  },
  // all units in px
  handleSize = 10,
  drawerSize = 250,
  bascule = 50,
  ...props
}) {
  let _opened = opened;
  let OPEN_POS = drawerSize;
  let CLOSE_POS = 0;
  let DISAPEARING_THRESHOLD = 3;
  let POINTER_EVENT_THRESHOLD = bascule / drawerSize;

  const [{ draw }, setSpring] = useSpring({
    draw: 0,
    config: config.default,
  });
  setSpring({ to: { draw: opened ? OPEN_POS : CLOSE_POS } });
  const gestures = useGestures({
    onMove: ({ deltaX }) => {
      let from, to;

      if (!opened) {
        from = CLOSE_POS;
        to = deltaX;
        _opened = deltaX > bascule;
      } else {
        from = OPEN_POS;
        to = OPEN_POS + deltaX;
        _opened = deltaX > -bascule;
      }
      setSpring({ from: { draw: from }, to: { draw: to } });
    },
    onRelease: () => onDraw(_opened),
  });

  return (
    <>
      <animated.nav
        style={{
          width: drawerSize,
          left: -drawerSize,
          transform: draw.interpolate(
            d =>
              `translate3d(${
                d < CLOSE_POS ? CLOSE_POS : d > OPEN_POS ? OPEN_POS : d
              }px, 0, 0)`,
          ),
        }}
        {...gestures}
      >
        {props.children}
        <animated.div
          className="handle"
          style={{
            width: handleSize,
            right: -handleSize,
            display: draw.interpolate(
              d => (d > DISAPEARING_THRESHOLD ? 'none' : 'block'),
            ),
          }}
        />
      </animated.nav>
      <animated.div
        className="overlay"
        style={{
          opacity: draw.interpolate(d => d / drawerSize),
          pointerEvents: draw.interpolate(
            d => (d < POINTER_EVENT_THRESHOLD ? 'none' : 'all'),
          ),
          display: draw.interpolate(
            d => (d < DISAPEARING_THRESHOLD ? 'none' : 'block'),
          ),
        }}
        onClick={() => _opened && onDraw(false)}
        onMouseDown={e => _opened && gestures.onMouseDown(e)}
        onTouchStart={e => _opened && gestures.onTouchStart(e)}
      />
    </>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
