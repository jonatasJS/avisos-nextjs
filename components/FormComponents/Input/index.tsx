import React, { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import { motion } from "framer-motion";

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
    <fieldset className={`${styles.uiInput} ${styles.__first} `}>
      <motion.input
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, x: -200 }}
        className={error ? "error" : ""}
        type="text"
        ref={inputRef}
        name={name}
        autoFocus={true}
        id="username"
        tabIndex={0}
        placeholder={placeholder}
        autoComplete="off"
        {...rest}
        style={{
          textAlign: "center"
        }}
      />
      <motion.label
        htmlFor="username"
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, x: -200 }}
      >
        <span data-text={label}>{label}</span>
      </motion.label>
    </fieldset>
  );
}
