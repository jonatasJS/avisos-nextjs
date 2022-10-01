import { motion } from "framer-motion";

import styles from "./styles.module.scss";

export default function Header() {
  return ( 
    <header className={styles.header}>
        <motion.span
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0, bounce: 1 }}
          exit={{ opacity: 0, y: -100 }}

          style={{
            background: "#ff5f5a"
          }}
        >
          <i
            className="fa fa-times"
            aria-hidden="true"
          ></i>
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2, bounce: 1 }}
          exit={{ opacity: 0, y: -100 }}

          style={{
            background: "#ffbe2e"
          }}
        >
          <i
            className="fa fa-minus"
            aria-hidden="true"
          ></i>
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, bounce: 1 }}
          exit={{ opacity: 0, y: -100 }}

          style={{
            background: "#2aca44"
          }}
        >
          <i
            className="fa fa-square-o"
            aria-hidden="true"
          ></i>
        </motion.span>
    </header>
  );
}

//  style="--color: #ff5f5a"
//  style="--color: #ffbe2e"
//  style="--color: #2aca44"