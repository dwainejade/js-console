import React, { useState } from "react";
import "./styles.css";
// import Split from "react-split";
import "codemirror/keymap/sublime";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import { Controlled as ControlledEditor } from "react-codemirror2";
import { javascript } from "@codemirror/lang-javascript";

import { FaPlay } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { MdDoNotDisturbAlt } from "react-icons/md";

export default function App() {
  const placeHolderCode = `for (let i = 0; i < 5; i++) {
    console.log(i);
  }`;

  const [code, setCode] = useState(placeHolderCode);
  const [output, setOutput] = useState([]);
  const [theme, setTheme] = useState({
    editor: "default",
    console: "light",
    body: "light"
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
  function handleOutput(code) {
    try {
      let result = JSON.stringify(eval(code));
      if (typeof result === "undefined") {
        return;
      } else setOutput([...output, console.logs]);
    } catch (e) {
      setOutput([...output, String(e)]);
    }
  }

  const handleTheme = () => {
    if (theme.editor === "default") {
      setTheme({ editor: "material", console: "dark", body: "dark" });
    } else {
      setTheme({ editor: "default", console: "light", body: "light" });
    }
  };

  function clearConsole() {
    setOutput([]);
  }

  return (
    <div className={`app ${theme.body}`}>
      <div className="container">
        <div className="editor">
          <div className="editor-header">
            {/* <div className="editor-title">index.js</div> */}
            <button className="btn run-btn" onClick={() => handleOutput(code)}>
              <FaPlay size={16} /> Run
            </button>
            <button className="btn" onClick={() => handleTheme()}>
              {theme.editor === "default" ? (
                <FaMoon size={16} />
              ) : (
                <FaSun size={16} />
              )}
            </button>
          </div>
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
        <button className="btn clear-btn" onClick={() => clearConsole()}>
          <MdDoNotDisturbAlt size={20} /> Clear
        </button>
        <div className={`console ${theme.console}`}>
          {output.map((l) => (
            <p className="cnsl-line">{l}</p>
          ))}
        </div>
        <p>{console.stdlog}</p>
      </div>
    </div>
  );
}
