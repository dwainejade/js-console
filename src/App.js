import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import "./App.scss";
import Editor from "./components/Editor";
import useLocalStorage from "./components/useLocalStorage";

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
    body: "light"
  });
  const [storage, setStorage] = useLocalStorage("js-ide-theme", "light");

  console.stdlog = console.log.bind(console);
  console.logs = [];
  console.log = function () {
    console.logs.push(Array.from(arguments));
    // console.stdlog.apply(console, arguments);
  };

  useEffect(() => {
    listEnd.current.scrollIntoView({
      behavior: "smooth"
    });
  }, [output]);

  function handleOutput(code) {
    try {
      let result = JSON.stringify(eval(code));

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
    if (storage === "light") {
      setStorage("dark");
    } else {
      setStorage("light");
    }
  };

  useLayoutEffect(() => {
    if (storage === "dark") {
      setTheme({
        editor: "material-darker",
        console: "dark",
        body: "dark"
      });
    } else {
      setTheme({
        editor: "juejin",
        console: "light",
        body: "light"
      });
    }
  }, [storage]);

  function clearConsole() {
    setOutput([]);
  }

  return (
    <div className={`app-wrapper fade-in ${theme.body}`}>
      <div className={`app fade-in`}>
        <div className="top-container">
          <div className="editor-wrapper">
            <div className="editor-header">
              <div className="editor-header-inner"></div>
            </div>
            <div className="editor">
              <Editor theme={theme} code={code} setCode={setCode} />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button className="btn run-btn" onClick={() => handleOutput(code)}>
            Run <FaPlay className="icon" />
          </button>

          <div className="toggle-container">
            {theme.body === "dark" ? (
              <input
                type="checkbox"
                id="toggle"
                checked
                onClick={() => handleTheme()}
              />
            ) : (
              <input
                type="checkbox"
                id="toggle"
                onClick={() => handleTheme()}
              />
            )}
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
                <div className="cnsl-line" key={Math.random()}>
                  {l}
                </div>
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
