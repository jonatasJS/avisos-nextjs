import React, { useRef, useEffect } from "react";
import { useField } from "@unform/core";

interface Inputrops {
  name: string;
  label: string;
  styles: any;
  type?: string;
  placeholder?: string;
}

export default function TextArea({
  name,
  label,
  styles,
  placeholder,
  ...rest
}: Inputrops) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
    });
  }, []);
  return (
    <fieldset
      className={`
              ${styles.formFieldset}
              ${styles.uiInput}
              ${styles.__second}
            `}
    >
      <textarea
        id="email"
        ref={inputRef}
        className={error ? "error" : ""}
        name={name}
        tabIndex={0}
        placeholder={placeholder}
        {...rest}
      />
      <label htmlFor="email">
        <span data-text={label}>{label}</span>
      </label>
    </fieldset>
  );
}
