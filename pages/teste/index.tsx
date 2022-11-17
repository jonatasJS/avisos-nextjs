import { useEffect, useRef, useState } from "react";
import Markdown from "markdown-to-jsx";

export default function Teste() {
  const [valueChanged, setValueChanged] = useState("");

  return (
    <div
      style={{
        color: "#fff",
        height: "100%",
        width: "100%",
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
          textAlign: "center",
        }}
        name="data"
        placeholder="Digite aqui"
        onChange={(e) => {
          setValueChanged(e.target.value);
        }}
      />
      <Markdown>{valueChanged}</Markdown>
    </div>
  );
}
