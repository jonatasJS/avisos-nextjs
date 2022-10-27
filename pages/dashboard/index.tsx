// desativer o tipescript e o eslint nesta linha
// @ts-nocheck
// @ts-ignore

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

import {
  FiClock,
  FiEdit,
  FiEdit2,
  FiLogOut,
  FiSave,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

import { AiOutlineClose } from "react-icons/ai";

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
  createdBy?: string;
  createdAt?: string;
  _id: string;
  editedBy?: string;
  editedAt?: string;
}

socket.on("addNewTodo", (data: string) => {
  console.log("Dashboard out:", data);
  toastContainer(
    `Um novo aviso criado por "${
      data[0].toUpperCase() + data.substring(1)
    }" com sucesso!`,
    "success"
  );
});

socket.on("deleteTodo", (data: string) => {
  console.log("Dashboard out:", data);
  const {
    deletedBy,
    title,
  }: {
    deletedBy: string;
    title: string;
  } = JSON.parse(data);
  toastContainer(
    `Aviso "${title}" deletado por ${
      deletedBy[0].toUpperCase() + deletedBy.substring(1)
    } com sucesso!`,
    "warning"
  );
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

export default function Dashboard({ todosBack }: { todosBack: Todos[] }) {
  const [todos, setTodos] = useState<Todos[]>(todosBack);
  const [isShowError, setIsShowError] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const avisosRef = useRef<HTMLDivElement>(null);
  const [messageIdEdit, setMessageIdEdit] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [bodyEdit, setBodyEdit] = useState("");
  const [userDataLocal, setUserDataLocal] = useState({} as UserDataProps);
  const [userDataServer, setUserDataServer] = useState({} as UserDataProps);

  // qual o socket emitir o evento de addNewTodo, ele vai receber o data e vai modificar o state de todos
  socket.on("addNewTodo", (data: string) => {
    console.clear();
    console.log("Dashboard in:", data);
    // toastContainer(`Aviso criado por "${data}" com sucesso!`, "success");
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
    const userIsExist = users.find((data) => data.username === user.username);

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
      setUserDataServer(user);
      setUserDataLocal(user);
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
      const userIsAdmin = users.find(
        (data) =>
          data.username === userDataLocal.username && data.isAdmin === true
      );

      if (!userIsAdmin) {
        toastContainer(
          "Você não tem permissão para criar um novo aviso!",
          "info"
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
            createdBy:
              (await userDataLocal.name) || (await userDataServer.name),
          });

          setTodos([...todos, dataApi]);
          toastContainer(
            `Aviso \"${dataApi.title}\" criada com sucesso!`,
            "success"
          );
          socket.emit("addNewTodo", userDataLocal.username);
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
      const userIsAdmin = users.find(
        (data) =>
          data.username === userDataLocal.username && data.isAdmin === true
      );

      if (!userIsAdmin) {
        toastContainer("Você não tem permissão para deletar um aviso!", "info");
        return;
      }

      const title = await todos.find((data) => data._id === id)?.title;
      const { data } = await api.delete(`/messange/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
      socket.emit(
        "deleteTodo",
        JSON.stringify({
          title,
          deletedBy: userDataLocal.username,
        })
      );
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
      console.log({
        id,
        title: titleEdit,
        body: bodyEdit,
        editedBy: userDataLocal.username,
      });
      await api.put(`/messange/${id}`, {
        title: titleEdit,
        body: bodyEdit,
        editedBy: userDataLocal.name,
      });

      toastContainer("Aviso atualizados com sucesso", "success");
      setMessageIdEdit("");
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        whileFocus={{ scale: 1.1 }}
        whileDrag={{ scale: 0.9 }}
        style={{
          zIndex: 999,
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          top: "20px",
          left: "20px",
          border: "none",
          cursor: "pointer",
          outline: "none",
          backdropFilter: "blur(10px)",
          padding: "10px",
          backgroundColor: users.find(
            (data) =>
              data.username === userDataServer.username && data.isAdmin === true
          )
            ? "rgba(0, 255, 0, 0.2)"
            : "rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px 1px ${
            users.find(
              (data) =>
                data.username === userDataServer.username &&
                data.isAdmin === true
            )
              ? "rgba(0, 255, 0, 0.2)"
              : "rgba(255, 255, 255, 0.1)"
          }`,
          maxWidth: "70px",
          height: "auto",
          borderRadius: "10px",
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0 }}
        >
          <Image
            src={`https://avatars.dicebear.com/api/identicon/${userDataLocal.username}.svg`}
            alt={userDataLocal.name}
            width={50}
            height={50}
            objectFit="cover"
          />
        </motion.span>
        <motion.tr
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          style={{
            width: "100%",
            height: "2px",
            margin: "10px 0",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <motion.span
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.4 }}
          style={{
            // name do usuario
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: "100%",
            left: "0%",
            color: "#fff",
            fontSize: ".7rem",
            fontWeight: "bold",
            textAlign: "center",
            whiteSpace: "pre-wrap",
            userSelect: "none"
          }}
        >
          {userDataLocal?.name}
        </motion.span>
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
            marginBottom: users.find(
              (data) =>
                data.username === userDataServer.username &&
                data.isAdmin === true
            )
              ? "-60px"
              : "60px",
            marginTop: "100px",
          }}
        >
          <Logo />
        </a>
      </Link>
      {/* verifica se é admin */}
      {users.find(
        (data) =>
          data.username === userDataServer.username && data.isAdmin === true
      ) && (
        <>
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
        </>
      )}
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
            {todos.map(
              (
                { title, body, createdBy, createdAt, _id, editedBy, editedAt },
                i
              ) => {
                console.log(_id, createdBy);

                return (
                  <motion.div
                    key={_id}
                    className={styles.avisosItem}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    exit={{ opacity: 0, y: 50 }}
                    title={!!createdBy ? `Criado por: ${createdBy}` : ""}
                    style={{
                      outline:
                        messageIdEdit === _id ? "2px solid #00f" : "none",
                    }}
                  >
                    <span
                      className={styles.penToEditTodo}
                      onClick={() => {
                        if (messageIdEdit === _id) {
                          // alert("Você já está editando este aviso");
                          setMessageIdEdit("");
                        } else {
                          setTitleEdit("");
                          setBodyEdit("");
                          setMessageIdEdit(_id);
                        }
                      }}
                    >
                      {messageIdEdit !== _id ? (
                        <FiEdit size={20} color="#fff" />
                      ) : (
                        <AiOutlineClose size={20} color="#fff" fill="#fff" />
                      )}
                    </span>
                    <h2
                      contentEditable={messageIdEdit === _id}
                      dangerouslySetInnerHTML={{
                        __html: title,
                      }}
                      onKeyUp={async (e) => {
                        if (e.target.innerHTML || messageIdEdit === _id) {
                          setTitleEdit(e.target.innerHTML);
                        } else {
                          setTitleEdit("");
                        }
                      }}
                      style={{
                        outline:
                          messageIdEdit === _id ? "2px solid #00f" : "none",
                        padding: messageIdEdit === _id ? "10px" : "0",
                        borderRadius: messageIdEdit === _id ? "5px" : "0",
                        transition: "all 0.2s",
                        boxShadow:
                          messageIdEdit === _id
                            ? "0 0 20px 1px #0000007f"
                            : "none",
                      }}
                    ></h2>
                    <p
                      style={{
                        outline:
                          messageIdEdit === _id ? "2px solid #00f" : "none",
                        padding: messageIdEdit === _id ? "10px" : "0",
                        borderRadius: messageIdEdit === _id ? "5px" : "0",
                        transition: "all 0.2s",
                        boxShadow:
                          messageIdEdit === _id
                            ? "0 0 20px 1px #0000007f"
                            : "none",
                      }}
                      contentEditable={messageIdEdit === _id}
                      onKeyUp={async (e) => {
                        console.log(e);
                        if (e.target.innerHTML || messageIdEdit === _id) {
                          setBodyEdit(e.target.innerHTML);
                        } else {
                          setBodyEdit("");
                        }
                      }}
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
                      <div className={styles.createdBy}>
                        <FiUser size={10} color="#fff" />
                        <span>{createdBy}</span>
                      </div>
                    )}
                    <div
                      className={styles.createdAt}
                      style={{
                        bottom: !!editedBy ? "55px" : "10px",
                      }}
                    >
                      <FiClock
                        size={10}
                        color="#fff"
                        onClick={() => handleDelete(_id)}
                      />
                      <span>
                        {moment(createdAt).format("DD/MM/YYYY hh:mm:ss")}
                      </span>
                    </div>
                    {editedBy && (
                      <>
                        <div className={styles.editedBy}>
                          <FiEdit2 size={10} color="#fff" />
                          <span>{editedBy}</span>
                        </div>
                        <div className={styles.editedAt}>
                          <FiClock size={10} color="#fff" />
                          <span>
                            {moment(editedAt).format("DD/MM/YYYY hh:mm:ss")}
                          </span>
                        </div>
                      </>
                    )}

                    {users.find(
                      (data) =>
                        data.username === userDataServer.username &&
                        data.isAdmin === true
                    ) && (
                      <div className={styles.avisosItemFooter}>
                        <button
                          style={{
                            bottom: "0px",
                            right: "25px",
                            backgroundColor:
                              messageIdEdit === _id ? "#282a36" : "#282a36",
                          }}
                          onClick={() => {
                            if (messageIdEdit === _id) {
                              handleEditMessage(_id);
                            } else {
                              handleDelete(_id);
                            }
                          }}
                          className={`${styles.btn} exclude`}
                        >
                          {messageIdEdit === _id ? (
                            <FiSave size={20} color="#fff" />
                          ) : (
                            <FiTrash2 size={20} color="#fff" />
                          )}
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps(context: GetStaticProps) {
  const { data: todosBack } = await api.get("/messanges");

  console.log(todosBack);

  return {
    props: {
      todosBack,
    },
  };
}
