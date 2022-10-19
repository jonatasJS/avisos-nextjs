import { useEffect, useRef, useState } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import moment from "moment";
import * as Yup from "yup";
import { socket } from "../_app";

import { FiClock, FiLogOut, FiUser } from "react-icons/fi";

import users from "../../data/database.json";

import api from "../../services/api";

import styles from "../../styles/Dashboard.module.scss";
import Input from "../../components/FormComponents/Input";
import TextArea from "../../components/FormComponents/TextArea";
import toastContainer from "../../services/toastContainer";
import Logo from "../../components/Logo";
import SEO from "../../components/SEO";
import Image from "next/image";

interface Todos {
  title: string;
  body: string;
  createdBy: string;
  createdAt: string;
  _id: string;
}

socket.on("addNewTodo", (data: Todos) => {
  toastContainer(`Aviso criado com sucesso!`, "success");
});

socket.on("deleteTodo", (data: Todos) => {
  toastContainer(`Aviso deletado com sucesso!`, "warning");
});

socket.on("login", (data: Todos) => {
  toastContainer(`${data} logado!`, "success");
});

socket.on("connect", () => {
  console.clear();
});

async function getTodos(setTodos: any) {
  const { data } = await api.get("/messanges");
  setTodos(data);
}

interface UserDataProps {
  username: string;
  name: string;
  isAdmin: boolean;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [isShowError, setIsShowError] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const avisosRef = useRef<HTMLDivElement>(null);
  const [messageIdEdit, setMessageIdEdit] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingBody, setEditingBody] = useState("");
  const [userData, setUserData] = useState({} as UserDataProps);

  // qual o socket emitir o evento de addNewTodo, ele vai receber o data e vai modificar o state de todos
  socket.on("addNewTodo", (data: Todos) => {
    console.clear();
    getTodos(setTodos);
  });

  // qual o socket emitir o evento de deleteTodo, ele vai receber o data e vai modificar o state de todos
  socket.on("deleteTodo", (data: Todos) => {
    console.clear();
    getTodos(setTodos);
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // percorrer o array de usuários e verificar se o usuário está cadastrado no localStorage (se o usuário está logado) e se o usuário é admin
    const userIsExist = users.find(
      (data) => data.username === user.username && data.isAdmin === true
    );

    // se o usuário não estiver logado, redirecionar para a página de login
    if (!user || !userIsExist) {
      Router.push("/login");
    }
  }, []);

  socket.on("newTodo", (todo: Todos) => {
    setTodos((oldTodos) => [...oldTodos, todo]);
    console.clear();
  });

  useEffect(() => {
    getTodos(setTodos);
    async function getUserDatasFromLocalStorage() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserData(user);
    }

    getUserDatasFromLocalStorage();
  }, []);

  async function handleSubmit(
    data: {
      title: string;
      body: string;
    },
    { reset }: { reset: () => void }
  ) {
    try {
      // veririca se o usuario é admin, se não for ele não pode criar um novo todo
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userIsAdmin = users.find(
        (data) => data.username === user.username && data.isAdmin === true
      );

      if (!userIsAdmin) {
        toastContainer(
          "Você não tem permissão para criar um novo todo",
          "error"
        );
        return;
      }

      const schema = Yup.object().shape({
        title: Yup.string().required("O título é obrigatório"),
        body: Yup.string().required("A descrição é obrigatória"),
      });

      await schema
        .validate(data, {
          abortEarly: false,
        })
        .then(async ({ title, body }) => {
          const { data: dataApi } = await api.post("/messanges", {
            title,
            body,
            createdBy: user.name,
          });

          setTodos([...todos, dataApi]);
          toastContainer(
            `Aviso \"${dataApi.title}\" criada com sucesso!`,
            "success"
          );
          socket.emit("addNewTodo", "addNewTodo");
          reset();

          // mover o scroll para o final da página
          setTimeout(() => {
            const layoutRef = document.getElementById("layout");
            // console.log(layoutRef);
            layoutRef?.scrollTo(0, layoutRef?.scrollHeight);
            avisosRef.current?.scrollTo(0, avisosRef.current?.scrollHeight);
          }, 500);

          formRef.current?.setErrors({});
        });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages: { [key: string]: string } = {};

        error.inner.forEach((err) => {
          errorMessages[err.path || 0] = err.message;
        });

        formRef.current?.setErrors(errorMessages);

        toastContainer(
          error.inner.length > 1 ? "Preenccha todos os campos" : error.message,
          "error"
        );
      }
    }
  }

  async function handleDelete(id: string) {
    try {
      // veririca se o usuario é admin, se não for ele não pode deletar um todo
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userIsAdmin = users.find(
        (data) => data.username === user.username && data.isAdmin === true
      );

      if (!userIsAdmin) {
        toastContainer("Você não tem permissão para deletar um todo", "error");
        return;
      }

      const { data } = await api.delete(`/messange/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
      socket.emit("deleteTodo", "deleteTodo");
      toast.warn(data.message, {
        theme: "dark",
      });
    } catch (err) {
      toastContainer("Internal Server Error", "error");
    }
  }

  async function handleSearch(e: any) {
    const { value } = e.target;
    if (!value || value === "") {
      const { data } = await api.get("/messanges");
      return setTodos(data);
    }

    const filtered = todos.filter((todo) => {
      return todo.title.toLowerCase().includes(value.toLowerCase());
    });

    if (!filtered.length) {
      const { data } = await api.get("/messanges");
      setTodos(data);
      setIsShowError(true);

      setTimeout(() => {
        setIsShowError(false);
      }, 3000);

      return !isShowError
        ? toastContainer("Nenhum aviso encontrado", "error")
        : null;
    }

    setTodos(filtered);
  }

  async function handleRefresh() {
    try {
      const { data } = await api.get("/messanges");
      setTodos(data);
      searchRef.current && (searchRef.current.value = "");
      toastContainer("Avisos atualizados com sucesso", "success");
    } catch (err) {
      toastContainer("Internal Server Error", "error");
    }
  }

  async function handleEditMessage(id: string) {
    try {
      await api.put(`/messange/${id}`, {
        title: editingTitle,
        body: editingBody,
      });

      toastContainer("Aviso atualizados com sucesso", "success");
    } catch (err) {
      toastContainer("Internal Server Error", "error");
    }
  }

  // ativar o modo de edição
  // function handleEdit(id: string) {
  //   const todo = todos.find((todo) => todo._id === id);
  //   if (todo) {
  //     setEditingId(todo._id);
  //   }

  return (
    <>
      <Head>
        <style>
          {`
          html,
          body,
          #__next {
            justify-content: center !important;
          }
          
          #layout {
            height: 90vh !important;
          }
          `}
        </style>
        <SEO
          title="Dashboard"
          description="Dashboard da aplicação"
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
      <motion.span
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        whileFocus={{ scale: 1.1 }}
        whileDrag={{ scale: 0.9 }}
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          top: "20px",
          left: "20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
          backdropFilter: "blur(10px)",
          padding: "10px",
          backgroundColor: userData?.isAdmin ? "rgba(255, 111, 33, 0.2)" : "rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px 1px ${userData?.isAdmin ? "rgba(255, 111, 33, 0.2)" : "rgba(255, 255, 255, 0.1)"}`,
          width: "4rem",
          height: "4rem",
          borderRadius: "10px",
        }}
        >
        <Image
          src={`https://avatars.dicebear.com/api/identicon/${userData.username}.svg`}
          alt={userData?.name}
          width={50}
          height={50}
          objectFit="cover"
        />
        <span
          style={{
            // name do usuario
            position: "absolute",
            top: "100%",
            left: "0%",
            marginTop: "10px",
            // transform: "translate(-50%, -50%)",
            color: "#fff",
            fontSize: ".5em",
            fontWeight: "bold",
            textAlign: "center",

          }}
        >
          {userData?.name}
        </span>
      </motion.span>
      <motion.button
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        whileFocus={{ scale: 1.2 }}
        whileDrag={{ scale: 0.9 }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none",
        }}
        onClick={() => {
          // remove o usuário do localStorage
          localStorage.removeItem("user");
          Router.push("/login");
          return toastContainer("Logout realizado com sucesso", "success");
        }}
        className={styles.btn}
      >
        <FiLogOut size={20} color="#fff" />
      </motion.button>
      <Link href="/">
        <a
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: "-60px",
            marginTop: "100px",
          }}
        >
          <Logo />
        </a>
      </Link>
      <header className={styles.header}>
        <h1>Cadastrar novo aviso</h1>
      </header>
      <main className={styles.main} ref={mainRef}>
        <Form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
          <Input
            styles={styles}
            name="title"
            label="Título"
            placeholder="Título do aviso"
            type="text"
          />

          <TextArea
            styles={styles}
            name="body"
            label="Descrição"
            placeholder="Descrição do aviso"
          />

          <motion.div
            className={styles.formFooter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            exit={{ opacity: 0 }}
          >
            <button className={styles.btn}>Cadastrar</button>
          </motion.div>
        </Form>
      </main>
      {!!todos.length && (
        <div className={styles.avisos} ref={avisosRef}>
          <h1>Avisos</h1>
          <div className={styles.searchTitle}>
            <input
              type="text"
              placeholder="Pesquisar por título"
              onChange={handleSearch}
              ref={searchRef}
            />
            <button className={styles.btn} onClick={handleRefresh}>
              Atualizar
            </button>
          </div>
          <div className={styles.avisosContainer}>
            {todos.map(({ title, body, createdBy, createdAt, _id }, i) => (
              <motion.div
                key={_id}
                className={styles.avisosItem}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                exit={{ opacity: 0, y: 50 }}
                title={!!createdBy ? `Criado por: ${createdBy}` : ""}
              >
                <h2
                  dangerouslySetInnerHTML={{
                    __html: title,
                  }}
                ></h2>
                <p
                  dangerouslySetInnerHTML={{
                    __html: body
                      .replaceAll("\n", "<br />")
                      .replaceAll(
                        `
                  `,
                        "<br />"
                      )
                      .replaceAll(
                        `
                    
                  `,
                        "<br /><br />"
                      ),
                  }}
                ></p>

                {createdBy && (
                  <>
                    <div className={styles.createdBy}>
                      <FiUser size={20} color="#fff" />
                      <span>{createdBy}</span>
                    </div>
                    <div className={styles.createdAt}>
                      <FiClock
                        size={20}
                        color="#fff"
                        onClick={() => handleDelete(_id)}
                      />
                      <span>
                        {moment(createdAt).format("DD/MM/YYYY hh:mm:ss")}
                      </span>
                    </div>
                  </>
                )}

                <div className={styles.avisosItemFooter}>
                  <button
                    style={{
                      bottom: createdBy ? "45px !important" : "0",
                    }}
                    onClick={() => handleDelete(_id)}
                    className={`${styles.btn} exclude`}
                    title="Excluir"
                  >
                    Excluir
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps(context: GetStaticProps) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
