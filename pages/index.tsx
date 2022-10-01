import Head from "next/head";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { motion } from "framer-motion";

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
    }

    getTodos();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setTodo((todo) => (todo + 1) % todos.length);
      },
      process.env.NODE_ENV === "development" ? 15000 : 15000
    );
    return () => clearInterval(interval);
  }, [todo, todos.length]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header />
      <motion.main
        className={styles.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <motion.div
          key={todos[todo]?.title}
          className={styles.title}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5, bounce: 1 }}
          exit={{ opacity: 0, y: -100 }}
        >
          <h1
            dangerouslySetInnerHTML={{
              __html: todos[todo]?.title,
            }}
          ></h1>
        </motion.div>
        <motion.div
          key={todos[todo]?.body}
          className={styles.description}
          style={{
            display: todos[todo]?.title.toLocaleLowerCase().includes("ramais")
              ? "flex"
              : "block",
            flexWrap: todos[todo]?.title.toLocaleLowerCase().includes("ramais")
              ? "wrap"
              : "nowrap",
            textAlign: todos[todo]?.title.toLocaleLowerCase().includes("ramais")
              ? "left"
              : "justify",
            justifyContent: todos[todo]?.title
              .toLocaleLowerCase()
              .includes("ramais")
              ? "center"
              : "",
            alignItems: todos[todo]?.title
              .toLocaleLowerCase()
              .includes("ramais")
              ? "start"
              : "",
            fontSize: todos[todo]?.title.toLocaleLowerCase().includes("ramais")
              ? "1.5rem"
              : "1.9rem",
          }}
          dangerouslySetInnerHTML={{
            __html: todos[todo]?.body
              .replaceAll("\n", "<br />")
              .replaceAll(
                `
            `,
                "<br />"
              )
              .replaceAll(
                `
              
            `,
                "<br />"
              ),
          }}
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6, bounce: 1 }}
          exit={{ opacity: 0, y: 500 }}
        >
          {/* <p>{todos[0].body}</p> */}
        </motion.div>
      </motion.main>
    </>
  );
};

export const getStaticProps = () => {
  return {
    paths: [],
    fallback: true,
    revalidate: 60,
  };
};

export default Home;
