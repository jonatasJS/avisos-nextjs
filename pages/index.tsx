import Head from "next/head";
import { useEffect, useState } from "react";
import type { GetStaticProps } from "next";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "markdown-to-jsx";
import plugins from "../services/plugins";
import { Editor, Viewer } from "@bytemd/react";

import { socket } from "./_app";

import api from "../services/api";

import Header from "../components/Header";

import styles from "../styles/Home.module.scss";
import SEO from "../components/SEO";
import axios from "axios";

interface Todos {
  title: string;
  body: string;
}

async function getTodos(setTodos: any) {
  const { data } = await api.get("/messages");
  setTodos(data);
}

const Home = ({ todosBack }: { todosBack: Todos[] }) => {
  const [todos, setTodos] = useState<Todos[]>(todosBack);
  const [todo, setTodo] = useState(0);
  const [version, setVersion] = useState(0);

  socket.on("addNewTodo", (data: Todos) => {
    getTodos(setTodos);
  });

  socket.on("deleteTodo", (data: Todos) => {
    getTodos(setTodos);
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        setTodo((todo) => (todo + 1) % todos?.length);
        axios.get("/api/version").then(({ data }) => {
          setVersion(data.version);
        });
      },
      process.env.NODE_ENV === "development" ? 3000 : 15000
    );
    return () => clearInterval(interval);
  }, [todo, todos?.length]);

  useEffect(() => {
    socket.on("refreshHome", (nameR) => {
      console.log("refreshHome:", nameR);
      // reload page
      window.location.reload();
    });
    const interval = setInterval(() => {
      // verificar se na rota /api/version tem uma nova versão, se tiver, recarregar a página, se não tiver, não fazer nada
      axios.get("/api/version").then((res) => {
        if (
          res.data.version !== process.env.NEXT_PUBLIC_VERSION &&
          res.data.version > version
        ) {
          setVersion(res.data.version);
          window.location.reload();
        }
      });
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(
      async () => {
        const { data } = await api.get("/messages");
        setTodos(data);
      },
      // 30000
      process.env.NODE_ENV === "development" ? 6000 : 30000
    );
    return () => clearInterval(interval);
  }, []);

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
      <AnimatePresence exitBeforeEnter>
        <motion.main
          className={styles.main}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.div
            key={todos[todo]?.title}
            className={styles.title}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.5,
              bounce: 0.5,
              type: "spring",
            }}
            exit={{ opacity: 0, y: -50 }}
          >
            {/* <h1
            dangerouslySetInnerHTML={{
              __html: nmd(todos[todo]?.title ? todos[todo].title : ''),
            }}
          ></h1> */}
            <Viewer
              value={todos[todo]?.title ? todos[todo].title : ""}
              plugins={plugins}
            ></Viewer>
          </motion.div>
          <motion.div
            key={todos[todo]?.body}
            className={`${styles.description}`}
            id={
              todos[todo]?.title.toLowerCase().includes("ramais")
                ? "ramais"
                : ""
            }
            style={{
              textAlign: todos[todo]?.title
                .toLocaleLowerCase()
                .includes("ramais")
                ? "left"
                : "justify",
              height: todos[todo]?.title.toLocaleLowerCase().includes("ramais")
                ? "auto"
                : "",
              fontSize: todos[todo]?.title
                .toLocaleLowerCase()
                .includes("ramais")
                ? "1.9rem"
                : "1.9rem",
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.6,
              bounce: 0.5,
              type: "spring",
              // bounceDamping: 10,
              // bounceStiffness: 500,
            }}
            exit={{ opacity: 0, y: 50 }}
          >
            <Viewer
              value={todos[todo]?.body ? todos[todo].body : ""}
              plugins={plugins}
            ></Viewer>
            {/* <Markdown>{todos[todo]?.body ? todos[todo].body : ""}</Markdown> */}
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </>
  );
};

export default Home;

// export async function getServersideProps() {

// }

export async function getStaticProps(context: GetStaticProps) {
  const { data: todosBack } = await api.get("/messages");

  return {
    props: {
      todosBack,
    },
    revalidate: 60,
  };
}
