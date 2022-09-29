import { useEffect, useState } from "react";
import type { NextPage } from "next";

import axios from "axios";

import styles from "../styles/Home.module.scss";

interface Todos {
  title: string;
  body: string;
}

const Home: NextPage = () => {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [todo, setTodo] = useState(0);

  useEffect(() => {
    async function getTodos() {
      const { data } = await axios.get("http://localhost:4000/messanges");
      setTodos(data);
      console.log(data);
    }

    getTodos();
  }, []);

  useEffect(() => {
    setInterval(() => setTodo((todo) => (todo + 1) % todos.length), 15000);
    console.log("todo", todo);
  }, [todo, todos.length]);

  return (
    <main className={styles.main}>
      <div className={styles.title}>
        <h1>{todos[todo]?.title}</h1>
      </div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: todos[todo]?.body.replaceAll("\n", "<br />") }}
      >
        {/* <p>{todos[0].body}</p> */}
      </div>
    </main>
  );
};

export default Home;
