import { useEffect, useState } from "react";
import type { NextPage } from "next"

import api from "../services/api";

import Header from "../components/Header";

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
      const { data } = await api.get("/messanges");
      setTodos(data);
      console.log(data);
    }

    getTodos();
  }, []);

  useEffect(() => {
    // faz mostrar uma por vez a cada 5 segundos
    const interval = setInterval(() => {
      setTodo((todo) => (todo + 1) % todos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [todo, todos.length]);

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.title}>
          <h1>{todos[todo]?.title}</h1>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{
            __html: todos[todo]?.body.replaceAll("\n", "<br />").replaceAll(`
            `, "<br />").replaceAll(`
              
            `, "<br />")
          }}
        >
          {/* <p>{todos[0].body}</p> */}
        </div>
      </main>
    </>
  );
};

export default Home;
