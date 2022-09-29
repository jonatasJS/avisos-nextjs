import styles from "./styles.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
        <span style={{
          background: "#ff5f5a"
        }}>
          <i
            className="fa fa-times"
            aria-hidden="true"
          ></i>
        </span>
        <span style={{
          background: "#ffbe2e"
        }}>
          <i
            className="fa fa-minus"
            aria-hidden="true"
          ></i>
        </span>
        <span style={{
          background: "#2aca44"
        }}>
          <i
            className="fa fa-square-o"
            aria-hidden="true"
          ></i>
        </span>
    </header>
  );
}

//  style="--color: #ff5f5a"
//  style="--color: #ffbe2e"
//  style="--color: #2aca44"