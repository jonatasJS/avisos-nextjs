import { useEffect, useState } from "react";
import moment from "moment";

import styles from "./styles.module.scss";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 className={styles.num}>
        {moment(time).format("HH")}
      </h1>
      <span className={styles.ponts}>:</span>
      <h1 className={styles.num}>
        {moment(time).format("mm")}
      </h1>
      <span className={styles.ponts}>:</span>
      <h1 className={styles.num}>
        {moment(time).format("ss")}
      </h1>
    </>
  );
}