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

export default function TextArea({
  name,
  label,
  styles,
  placeholder,
  ...rest
}: Inputrops) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { fieldName, error, registerField } = useField(name);

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
      <motion.textarea
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, x: 200 }}
        id="email"
        ref={inputRef}
        className={error ? "error" : ""}
        name={name}
        tabIndex={0}
        placeholder={placeholder}
        {...rest}
      />
      <motion.label
        htmlFor="email"
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, x: 200 }}
      >
        <span data-text={label}>{label}</span>
      </motion.label>
    </fieldset>
  );
}
