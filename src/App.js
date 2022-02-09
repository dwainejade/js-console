import React, { useState, useRef, useEffect } from "react";
import "./App.scss";
// import LightBG from "./images/BG-Lightmode.png";
import "codemirror/keymap/sublime";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/juejin.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import { Controlled as ControlledEditor } from "react-codemirror2";
import { javascript } from "@codemirror/lang-javascript";

import { FaPlay } from "react-icons/fa";
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { MdDoNotDisturbAlt } from "react-icons/md";

function App() {
  const placeHolderCode = `for (let i = 0; i < 5; i++) {
    console.log(i);
  }`;

  const [code, setCode] = useState(placeHolderCode);
  const [output, setOutput] = useState([]);
  const listEnd = useRef();
  const [theme, setTheme] = useState({
    editor: "juejin",
    console: "light",
    body: "light",
    BG: 1
  });

  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function () {
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments);
  };

  function handleInput(editor, data, value) {
    setCode(value);
  }

  useEffect(() => {
    listEnd.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [output]);

  function handleOutput(code) {
    try {
      let result = JSON.stringify(eval(code));
      // if (result === undefined) {
      //   result = "";
      // }
      if (console.logs) {
        setOutput(output.concat(console.logs, result));
      } else {
        setOutput([...output, result]);
      }
    } catch (e) {
      setOutput([...output, String(e)]);
    }
  }

  const handleTheme = () => {
    if (theme.editor === "juejin") {
      setTheme({
        editor: "material-darker",
        console: "dark",
        body: "dark",
        slider: true
      });
    } else {
      setTheme({ editor: "juejin", console: "", body: "", slider: false });
    }
  };

  function clearConsole() {
    setOutput([]);
  }

  return (
    <div className={`app-wrapper fade-in ${theme.body}`}>
      {/* <div
        style={{
          background: `url(${LightBG}) no-repeat center fixed`,
          position: "absolute",
          height: "100vh",
          width: "100vw",
          zIndex: -1,
          backgroundSize: "cover"
        }}
      /> */}
      <div className={`app fade-in`}>
        <div className="top-container">
          <div className="editor-wrapper">
            <div className="editor-header">
              <div className="editor-header-inner"></div>
            </div>
            <div className="editor">
              <ControlledEditor
                onBeforeChange={handleInput}
                value={String(code)}
                className="codemirror-input"
                options={{
                  lineNumbers: true,
                  lineWrapping: true,
                  lint: true,
                  mode: javascript,
                  theme: theme.editor
                }}
              />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button className="btn run-btn" onClick={() => handleOutput(code)}>
            Run <FaPlay className="icon" />
          </button>
          {/* <input class="toggle" type="checkbox" checked={theme.slider} onClick={() => handleTheme()} /> */}

          <div className="toggle-container">
            <input type="checkbox" id="toggle" onClick={() => handleTheme()} />
            <label htmlFor="toggle" className="toggle-label">
              <FaRegMoon className="moon" />
              <FiSun className="sun" />
              <span className="toggle-ball" />
            </label>
          </div>

          <button className="btn clear-btn" onClick={() => clearConsole()}>
            Clear <MdDoNotDisturbAlt className="icon" />
          </button>
        </div>

        <div className="bottom-container">
          <div className="console-wrapper">
            <div className={`console ${theme.console}`}>
              {output.map((l) => (
                <div className="cnsl-line">{l}</div>
              ))}
              <div ref={listEnd} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
