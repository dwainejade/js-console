import React from "react";
import "codemirror/keymap/sublime";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/juejin.css";
import "codemirror/theme/material-darker.css";
import "codemirror/mode/javascript/javascript";
import { Controlled as ControlledEditor } from "react-codemirror2";

const Editor = ({ code, setCode, theme }) => {
  const handleInput = (editor, data, value) => {
    setCode(value);
  };

  return (
    <ControlledEditor
      onBeforeChange={handleInput}
      value={String(code)}
      className="codemirror-input"
      options={{
        lineNumbers: true,
        lineWrapping: true,
        lint: true,
        mode: "javascript",
        theme: theme.editor
      }}
    />
  );
};
export default Editor;
