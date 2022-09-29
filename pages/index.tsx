import { useEffect, useState } from "react";
import type { NextPage } from "next";

import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Todo 1",
      body: "<strong>Todo</strong> 1 body<br />Todo 1 body",
    },
    {
      id: 2,
      title: "Todo 2",
      body: "Todo 2 body",
    },
    {
      id: 3,
      title: "Todo 3",
      body: "<strong>Todo</strong> 3 body<br />Todo 1 body",
    },
    {
      id: 4,
      title: "Todo 4",
      body: "Todo 4 body",
    }
  ]);
  const [todo, setTodo] = useState(0);

  useEffect(() => {
    setInterval(() => setTodo((todo) => (todo + 1) % todos.length), 15000);
  }, [todos.length]);

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>{todos[todo].title}</h1>
      </div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: todos[todo].body }} 
      >
        {/* <p>{todos[0].body}</p> */}
      </div>
    </main>
  );
};

export default Home;
