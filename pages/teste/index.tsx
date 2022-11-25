import { useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";
import plugins from "../../services/plugins";
import { Editor, Viewer } from "@bytemd/react";
import byteMDLocale from 'bytemd/locales/pt_BR.json';

export default function Teste() {
  const [valueChanged, setValueChanged] = useState("");
  const [value, setValue] = useState("");

  return (
    <>
      {/* <div
        style={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h1
          style={{
            color: "#fff",
            width: "50%",
            display: "flex",
            alignItems: "center",
            // justifyContent: "center",
            flexDirection: "column",
          }}
        >
          teste do Markdown <p>para imagens:</p>
          <strong>![titulo opicional](url)</strong>
        </h1>
        <textarea
          style={{
            color: "#000",
            padding: 10,
            borderRadius: 10,
            height: 100,
            width: 500,
            minHeight: 50,
          }}
          name="data"
          placeholder="Digite aqui"
          onChange={(e) => {
            setValueChanged(e.target.value);
          }}
        />
        <Markdown className="markdown-body">{valueChanged}</Markdown>
      </div> */}
      <div
        style={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <Editor
          value={value}
          plugins={plugins}
          mode="tab"
          placeholder="Digite aqui"
          onChange={(v) => {
            console.log(v);
            setValue(v);
          }}
          locale={byteMDLocale}
        />

        <Viewer value={value} plugins={plugins} />
      </div>
    </>
  );
}
