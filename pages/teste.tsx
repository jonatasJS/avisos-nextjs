import React, { useState } from "react";
import nmd from 'nano-markdown';
// import { Editor } from "react-draft-wysiwyg";

export default function Teste() {
  const [text, setText] = useState("");

  return (
    <div>
      <textarea
        name="" 
        id=""
        style={{
          width: "100%",
          height: "300px",
          padding: "10px",
          background: "transparent",
        }}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <div dangerouslySetInnerHTML={{ __html: nmd(text) }}></div>
    </div>
  );
}
