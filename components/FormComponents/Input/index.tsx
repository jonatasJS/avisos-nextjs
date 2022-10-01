import React, { useRef, useEffect } from "react";
import { useField } from "@unform/core";

interface Inputrops {
  name: string;
  label: string;
  styles: any;
  type?: string;
  placeholder?: string;
}

export default function Input({
  name,
  label,
  styles,
  placeholder,
  ...rest
}: Inputrops) {
  const inputRef = useRef<HTMLInputElement>(null);
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
      className={`${styles.uiInput} ${styles.__first} `}
    >
      <input
        className={error ? "error" : ""}
        type="text"
        ref={inputRef}
        name={name}
        autoFocus={true}
        id="username"
        tabIndex={0}
        placeholder= {placeholder}
        autoComplete="off"
        {...rest}
      />
      <label htmlFor="username">
        <span
          data-text={label}
        >{label}</span>
      </label>
    </fieldset>
  );
}
