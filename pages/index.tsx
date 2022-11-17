import Head from "next/head";
import { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import { motion } from "framer-motion";
import nmd from "nano-markdown";
import convertToHTML from 'markdown-to-html-converter';

import { socket } from "./_app";

import api from "../services/api";

import Header from "../components/Header";

import styles from "../styles/Home.module.scss";
import SEO from "../components/SEO";

interface Todos {
  title: string;
  body: string;
}

socket.on("connect", () => {
  console.clear();
});

async function getTodos(setTodos: any) {
  const { data } = await api.get("/messages");
  setTodos(data);
}

const Home = ({ todosBack }: { todosBack: Todos[] }) => {
  const [todos, setTodos] = useState<Todos[]>(todosBack);
  const [todo, setTodo] = useState(0);

  socket.on("addNewTodo", (data: Todos) => {
    console.clear();
    getTodos(setTodos);
  });

  socket.on("deleteTodo", (data: Todos) => {
    console.clear();

    getTodos(setTodos);
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        setTodo((todo) => (todo + 1) % todos?.length);
      },
      process.env.NODE_ENV === "development" ? 3000 : 15000
    );
    return () => clearInterval(interval);
  }, [todo, todos?.length]);

  return (
    <>
      <Head>
        <title>Home</title>
        <SEO
          title="Avisos"
          description="Avisos da para os colaboradores da empresa"
          author="Jônatas"
          countryName="Brasil"
          email="soaresjonatas398@gmail.com"
          image="https://api.microlink.io?url=https%3A%2F%2Favisos.jonatas.app&overlay.browser=dark&overlay.background=linear-gradient(225deg%2C%20%23FF057C%200%25%2C%20%238D0B93%2050%25%2C%20%23321575%20100%25)&screenshot=true&meta=false&embed=screenshot.url"
          language="pt-BR"
          phoneNumber="+55 63 9 84707053"
          themeColor="#FF6F21"
          url="https://avisos.jonatas.app/"
          website="https://avisos.jonatas.app/"
        />
      </Head>
      <Header title={todos[todo]?.title} showTitle={false} />
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
              __html: convertToHTML(todos[todo]?.title ? todos[todo].title : '') // nmd(todos[todo]?.title ? todos[todo].title : ''),
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
            __html: convertToHTML(todos[todo]?.body ? todos[todo].body : '') // nmd(todos[todo]?.body ? todos[todo].body : '')
          }}
          initial={{ opacity: 0, y: 500 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6, bounce: 1 }}
          exit={{ opacity: 0, y: 500 }}
        >
        </motion.div>
      </motion.main>
    </>
  );
};

export default Home;

// export async function getServersideProps() {

// }

export async function getStaticProps(context: GetStaticProps) {
  const { data: todosBack } = await api.get("/messages");

  console.log(todosBack);

  return {
    props: {
      todosBack,
    },
    revalidate: 60,
  };
}
