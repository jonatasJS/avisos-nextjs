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
import Markdown from "markdown-to-jsx";
import * as Yup from "yup";
import FPSStats from "react-fps-stats";
import Modal from "react-bootstrap/Modal";
import { TbRefresh } from "react-icons/tb";

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
import { Button } from "react-bootstrap";

let Users: UserDataProps[] = users;

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
  toastContainer(
    `Um novo aviso criado por "${data[0].toUpperCase() + data.substring(1)
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
    `Aviso "${title}" deletado por ${deletedBy[0].toUpperCase() + deletedBy.substring(1)
    } com sucesso!`,
    "warning"
  );
});

socket.on("editTodo", (data: string) => {
  console.log("Dashboard out:", data);
  const {
    editedBy,
    title,
  }: {
    editedBy: string;
    title: string;
  } = JSON.parse(data);
  toastContainer(
    `Aviso "${title}" editado por ${editedBy[0].toUpperCase() + editedBy.substring(1)
    } com sucesso!`,
    "info"
  );
});

// logout
socket.on("logout", (data: string) => {
  if (data == null) return;
  console.log("Dashboard out:", data);
  toastContainer(
    `${data ? "Usuario \"" + data[0].toUpperCase() + data.substring(1) : "Alguém"}" saiu do sistema!`,
    "info"
  );
});

socket.on("login", ({
  data,
  users
}: {
  data: Todos, users: UserDataProps[]
}) => {
  if (data == null) return;
  toastContainer(`${data} logado!`, "success");

  Users = Users.map((user) => {
    if (users.includes(user.username)) {
      user.isOnline = true;
    } else {
      user.isOnline = false;
    }
    return user;
  });
});

async function getTodos(setTodos: any) {
  const { data } = await api.get("/messages");
  setTodos(data);
}

interface UserDataProps {
  username: string;
  name: string;
  isAdmin: boolean;
  isOnline: boolean;
  profile: string;
}

export default function Dashboard({ todosBack, screenTimeServer }: { todosBack: Todos[]; screenTimeServer: number }) {
  const [todos, setTodos] = useState<Todos[]>(todosBack);
  const [isShowError, setIsShowError] = useState(false);
  const [deleteMessageVisible, setDeleteMessageVisible] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const avisosRef = useRef<HTMLDivElement>(null);
  const [messageIdEdit, setMessageIdEdit] = useState("");
  const [titleEdit, setTitleEdit] = useState("");
  const [bodyEdit, setBodyEdit] = useState("");
  const [titleDelete, setTitleDelete] = useState("");
  const [messageIdDelete, setmMessageIdDelete] = useState("");
  const [userDataLocal, setUserDataLocal] = useState({} as UserDataProps);
  const [userDataServer, setUserDataServer] = useState({} as UserDataProps);
  const [screenTimeValue, setScreenTimeValue] = useState(0);
  const [screenTimeServer_, setScreenTimeServer_] = useState(screenTimeServer || 0);
  const patternString = "\d{1,3}";
  const [urlSong, setUrlSong] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  // quando o socket emitir o evento de addNewTodo, ele vai receber o data e vai modificar o state de todos
  socket.on("addNewTodo", (data: string) => {
    console.log("Dashboard in:", data);
    setUrlSong("/audio/createSucess.mp3");
    audioRef.current?.play();
    // toastContainer(`Aviso criado por "${data}" com sucesso!`, "success");
    getTodos(setTodos);
  });

  // quando o socket emitir o evento de deleteTodo, ele vai receber o data e vai modificar o state de todos
  socket.on("deleteTodo", (data: Todos) => {
    getTodos(setTodos);
    setUrlSong("/audio/createSucess.mp3");
    audioRef.current?.play();
  });

  // quando o socket emitir o evento de editTodo, ele vai receber o data e vai modificar o state de todos
  socket.on("editTodo", (data: Todos) => {
    getTodos(setTodos);
    setUrlSong("/audio/createSucess.mp3");
    audioRef.current?.play();
  });

  // quando o socket emitir o evento de login, ele vai modificar o state do todos os usuários com o data que é o username
  socket.on("login", ({
    data,
    users
  }: {
    data: Todos, users: UserDataProps[]
  }) => {
  if (data == null) return;
    if (data == userDataLocal.username) return;
    console.log("login:", data);
    console.log(audioRef.current);
    setUrlSong("/audio/joinUser.mp3");
    audioRef.current?.play();
    Users = Users.map((user) => {
      if (user.username === data) {
        user.isOnline = true;
      }
      return user;
    });
    setUserDataServer(
      Users.find((user) => {
        // verificar data é o username de user e ou o username é diferente do user local
        if (
          user.username === data ||
          user.username !== userDataLocal.username
        ) {
          return user;
        } else {
          return null;
        }
      }) as UserDataProps
    );

    Users = Users.map((user) => {
      if (users.includes(user.username)) {
        user.isOnline = true;
      } else {
        user.isOnline = false;
      }
      return user;
    });
  });

  // quando o socket emitir o evento de logout, ele vai modificar o state do todos os usuários com o data que é o username
  socket.on("logout", (data: string) => {
  if (data == null) return;
    console.log("logout", data);
    setUrlSong("/audio/joinUser.mp3");
    audioRef.current?.play();
    Users = Users.map((user) => {
      if (user.username === data) {
        user.isOnline = false;
      }
      return user;
    });
    setUserDataServer(
      Users.find((user) => user.username === data) as UserDataProps
    );
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

  socket.on("newTodo", async (todo: Todos) => {
    setTodos((oldTodos) => [...oldTodos, todo]);
    setUrlSong("/audio/createSucess.mp3");
    audioRef.current?.play();
  });

  socket.on(
    "usersOnline",
    (
      // users é uma string que vem do servidor e é convertida para um array de strings
      users: string[]
    ) => {
  if (users == null) return;
      console.log("usersOnline:", users);
      // percorrer o array de usuários e verificar se o usuário foi encontrado no array de usuários online
      Users = Users.map((user) => {
        if (users.includes(user.username)) {
          user.isOnline = true;
        } else {
          user.isOnline = false;
        }
        return user;
      });
    }
  );

  useEffect(() => {
    async function getUserDatasFromLocalStorage() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserDataServer(user);
      setUserDataLocal(user);

      !isOnline && socket.emit("login", user.username);
      !isOnline && socket.emit("usersOnline", user.username);

      setIsOnline(true);

      socket.on(
        "usersOnline",
        (
          // users é uma string que vem do servidor e é convertida para um array de strings
          users: string[]
        ) => {
          console.log("usersOnline:", users);
          // percorrer o array de usuários e verificar se o usuário foi encontrado no array de usuários online
          Users = Users.map((user) => {
            if (users.find((username) => username === user.username)) {
              user.isOnline = true;
            } else {
              user.isOnline = false;
            }
            return user;
          });
        }
      );
    }

    getUserDatasFromLocalStorage();
  }, []);

  async function handleSubmit(
    data: {
      title: string;
      body: string;
      screenTime: string;
    },
    { reset }: { reset: () => void }
  ) {
    try {
      const userIsAdmin = users.find(
        (data) =>
          data.username === userDataLocal.username && data.isAdmin === true
      );

      if (!userIsAdmin) {
        setUrlSong("/audio/err.mp3");
        audioRef.current?.play();
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
        .then(async ({ title, body, screenTime }) => {
          const { data: dataApi } = await api.post("/messages", {
            title,
            body,
            createdBy:
              (await userDataLocal.name) || (await userDataServer.name),
            screenTime
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


  async function handleChangeTime(time: number) {
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
    
    await api.post("/screentime", {
      time
    });

    socket.emit('changeTime', time);
    return setScreenTimeServer_((await api.get("/screentime")).data);
  }

  async function handleDelete(id: string) {
    try {
      const userIsAdmin = users.find(
        (data) =>
          data.username === userDataLocal.username && data.isAdmin === true
      );

      if (!userIsAdmin) {
        toastContainer("Você não tem permissão para deletar um aviso!", "info");

        setUrlSong("/audio/err.mp3");
        audioRef.current?.play();
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
      const { data } = await api.get("/messages");
      return setTodos(data);
    }

    const filtered = todos.filter((todo) => {
      // ilter title or description

      return (
        todo.title.toLowerCase().includes(value.toLowerCase()) ||
        todo.body.toLowerCase().includes(value.toLowerCase())
      );
    });

    if (!filtered.length) {
      const { data } = await api.get("/messages");
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
    socket.emit("refreshHome", userDataLocal.username);
    try {
      const { data } = await api.get("/messages");
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
        title: titleEdit,
        body: bodyEdit,
        editedBy: userDataLocal.name,
      });

      const newTodos = todos.map((todo) => {
        if (todo._id === id) {
          return {
            ...todo,
            title: titleEdit,
            body: bodyEdit,
          };
        }

        return todo;
      });

      setTodos(newTodos);

      socket.emit(
        "editTodo",
        JSON.stringify({
          title: todos.find((todo) => todo._id === id)?.title,
          editedBy: userDataLocal.username,
        })
      );

      toastContainer("Aviso atualizados com sucesso", "success");
      setMessageIdEdit("");
      handleRefresh();
    } catch (err) {
      toastContainer("Internal Server Error", "error");
    }
  }

  return (
    <>
      {/* modal to confirm delete todo */}
      <Modal
        show={deleteMessageVisible}
        size="lm"
        centered
        onHide={() => {
          setDeleteMessageVisible(false);
        }}
        themeColor={"dark"}
      >
        <Modal.Dialog
          style={{
            margin: "0",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title
            // dangerouslySetInnerHTML={{
            //   __html: `${nmd(titleDelete)}`,
            // }}
            >
              <Markdown>{titleDelete}</Markdown>
              {/* {html2md(titleDelete)} */}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p
              dangerouslySetInnerHTML={{
                __html: `Você está prestes a deletar ${
                  /*nmd(*/ titleDelete /*)*/
                  }!`,
              }}
            />
            <p>Caso delete não tera como recuperá-lo!</p>
          </Modal.Body>

          <Modal.Footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p>{messageIdDelete}</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                onClick={() => {
                  setDeleteMessageVisible(false);
                  setTitleDelete("");
                  setmMessageIdDelete("");
                }}
                variant="secondary"
              >
                Fechar
              </Button>
              <Button
                onClick={async () => {
                  await handleDelete(messageIdDelete);
                  setDeleteMessageVisible(false);
                  setTitleDelete("");
                  setmMessageIdDelete("");
                }}
                variant="danger"
              >
                Sim, apagar
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>

      <Head>
        <style>
          {`
            html,
            body,
            #__next {
              justify-content: center !important;
              height: auto !important;
              width: 100vw !important;
              overflow-x: hidden !important;
              overflow-y: auto !important;
            }

            html:-webkit-scrollbar-track,
            body:-webkit-scrollbar-track,
            #__next:-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              border-radius: 10px;
              background-color: transparent;
            }
          
            html::-webkit-scrollbar,
            body::-webkit-scrollbar,
            #__next::-webkit-scrollbar {
              width: 12px;
              background-color: transparent;
            }
          
            html::-webkit-scrollbar-thumb,
            body::-webkit-scrollbar-thumb,
            #__next::-webkit-scrollbar-thumb {
              border-radius: 10px;
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              background-color: #44475a;
            }
            
            */ #layout {
              height: 90vh !important;
            } */
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

      <div
        style={{
          zIndex: 999,
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          gap: 5,
          justifyContent: "center",
          alignItems: "flex-start",
          top: "20px",
          left: "20px",
          userSelect: "none",
        }}
      >
        <motion.span
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          whileFocus={{ scale: 1.1 }}
          whileDrag={{ scale: 0.9 }}
          style={{
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            cursor: "pointer",
            outline: "none",
            backdropFilter: "blur(10px)",
            padding: "10px",
            backgroundColor: users.find(
              (data) =>
                data.username === userDataServer.username &&
                data.isAdmin === true
            )
              ? "rgba(0, 255, 0, 0.2)"
              : "rgba(255, 255, 255, 0.1)",
            boxShadow: `0 0 20px 1px ${users.find(
              (data) =>
                data.username === userDataServer.username &&
                data.isAdmin === true
            )
              ? "rgba(255, 213, 0, 0.2)"
              : "rgba(255, 255, 255, 0.1)"
              }`,
            border: `1px solid ${users.find(
              (data) =>
                data.username === userDataServer.username &&
                data.isAdmin === true
            )
              ? "rgba(255, 213, 0, 0.5)"
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
              src={
                userDataLocal.profile
                  ? userDataLocal.profile
                  : `https://avatars.dicebear.com/api/identicon/${userDataLocal.username}.svg`
              }
              alt={userDataLocal.name}
              style={{
                borderRadius:
                  userDataLocal.username === "admin" ? "50%" : "0px",
              }}
              width={50}
              height={50}
              objectFit="cover"
            />
          </motion.span>
          <tr
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
              userSelect: "none",
            }}
          >
            {userDataLocal?.name}
          </motion.span>
        </motion.span>

        {/* listra usuarios que estão online  */}
        {!!Users &&
          Users.map(
            (e, i) =>
              e.username !== userDataLocal.username && (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  whileFocus={{ scale: 1.1 }}
                  whileDrag={{ scale: 0.9 }}
                  style={{
                    zIndex: 999,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                    backdropFilter: "blur(10px)",
                    padding: "10px",
                    backgroundColor: e.isOnline
                      ? "rgba(0, 255, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.1)",
                    boxShadow: `0 0 20px 1px ${e.isOnline
                      ? e.isAdmin
                        ? "rgba(255, 213, 0, 0.2)"
                        : "rgba(0, 255, 0, 0.2)"
                      : "rgba(255, 255, 255, 0.1)"
                      }`,
                    border: `1px solid ${e.isAdmin
                      ? "rgba(255, 213, 0, 0.5)"
                      : "rgba(255, 255, 255, 0.1)"
                      }`,
                    maxWidth: "40px",
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
                      src={
                        e.profile
                          ? e.profile
                          : `https://avatars.dicebear.com/api/identicon/${e.username}.svg`
                      }
                      alt={e.name}
                      style={{
                        borderRadius: e.username === "admin" ? "50%" : "none",
                      }}
                      width={40}
                      height={40}
                      objectFit="cover"
                      title={e.name}
                    />
                  </motion.span>
                </motion.span>
              )
          )}
      </div>

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
          socket.emit("logout", userDataLocal.username);
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
            marginTop: "50px",
            marginLeft: "300px",
            marginRight: "300px"
          }}
        >
          <Logo />
        </a>
      </Link>

      <div
        className={styles.screeTimeContainer}
      >
        <input
          value={screenTimeServer_ == screenTimeValue ? screenTimeServer_ : screenTimeValue}
          onChange={e => setScreenTimeValue(e.target.value)}
          type="number"
          pattern={patternString}
          max="999"
          placeholder="0"
        />
        <span>
          segundos{" "}
          {(screenTimeServer_ != screenTimeValue) ?
            <TbRefresh
              size={25}
              style={{
                cursor: "pointer"
              }}
              onClick={() => handleChangeTime(screenTimeValue)}
            />
          : ""
          }
        </span>
      </div>

      {/* verifica se é admin */}
      {users.find(
        (data) =>
          data.username === userDataServer.username && data.isAdmin === true
      ) && (
          <>
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
              placeholder="Pesquisar por título ou conteudo"
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
                { title, body, screenTime, createdBy, createdAt, _id, editedBy, editedAt },
                i
              ) => {
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
                          handleRefresh();
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
                      // dangerouslySetInnerHTML={{
                      //   __html: nmd(title),
                      // }}
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
                    >
                      <Markdown>{title}</Markdown>
                    </h2>
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
                    // dangerouslySetInnerHTML={{
                    //   __html: nmd(body),
                    // }}
                    >
                      <Markdown>{body}</Markdown>
                    </p>


                    <div className={styles.logs}>
                      <span>
                        {screenTime}
                      </span>
                      {createdBy && (
                        <motion.div
                          className={styles.createdBy}
                          initial={{ opacity: 0, y: 100 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          whileFocus={{ scale: 1.1 }}
                          whileDrag={{ scale: 0.9 }}
                        >
                          <FiUser size={10} color="#fff" />
                          <span>{createdBy}</span>
                        </motion.div>
                      )}
                      <motion.div
                        className={styles.createdAt}
                        style={{
                          bottom: !!editedBy ? "55px" : "10px",
                        }}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        whileFocus={{ scale: 1.1 }}
                        whileDrag={{ scale: 0.9 }}
                      >
                        <FiClock
                          size={10}
                          color="#fff"
                          onClick={() => handleDelete(_id)}
                        />
                        <span>
                          {moment(createdAt).format("DD/MM/YYYY hh:mm:ss")}
                        </span>
                      </motion.div>
                      {editedBy && (
                        <>
                          <motion.div
                            className={styles.editedBy}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            whileFocus={{ scale: 1.1 }}
                            whileDrag={{ scale: 0.9 }}
                          >
                            <FiEdit2 size={10} color="#fff" />
                            <span>{editedBy}</span>
                          </motion.div>
                          <motion.div
                            className={styles.editedAt}
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            whileFocus={{ scale: 1.1 }}
                            whileDrag={{ scale: 0.9 }}
                          >
                            <FiClock size={10} color="#fff" />
                            <span>
                              {moment(editedAt).format("DD/MM/YYYY hh:mm:ss")}
                            </span>
                          </motion.div>
                        </>
                      )}
                    </div>

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
                                setTitleDelete(title);
                                setmMessageIdDelete(_id);
                                setDeleteMessageVisible(true);
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
      <audio src={urlSong} autoPlay ref={audioRef} controls={false}></audio>
      {console.log(urlSong)}
    </>
  );
}

export async function getStaticProps(context: GetStaticProps) {
  const { data: todosBack } = await api.get("/messages");
  const { data: screenTimeServer } = await api.get("/screentime");

  console.log(screenTimeServer);

  return {
    props: {
      todosBack,
      screenTimeServer
    },
    revalidate: 60,
  };
}
