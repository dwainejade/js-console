import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
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
  const listEnd = useRef();
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

  useEffect(() => {
    listEnd.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  }, [output]);

  function handleOutput(code) {
    try {
      let result = JSON.stringify(eval(code));
      if (result === undefined) {
        result = "no return";
      }
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
    <div className={`app fade-in  ${theme.body}`}>
      <div className="container">
        <div className="editor">
          <div className="editor-header fade-in">
            <button className="btn run-btn" onClick={() => handleOutput(code)}>
              <FaPlay size={16} /> Run
            </button>
            <button
              className={`btn theme-btn ${theme.body}`}
              onClick={() => handleTheme()}
            >
              {theme.editor === "default" ? (
                <FaMoon className="theme-icon light" size={18} />
              ) : (
                <FaSun className="theme-icon dark" size={18} />
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
          {output.map((l, key = l.id) => (
            <div className="cnsl-line">{l}</div>
          ))}
          <div ref={listEnd}></div>
        </div>
      </div>
    </div>
  );
}
