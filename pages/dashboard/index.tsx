import Router from "next/router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import { FiLogOut } from "react-icons/fi";
import * as Yup from "yup";
import { socket } from "../_app";

import users from "../../data/database.json";

import api from "../../services/api";

import styles from "../../styles/Dashboard.module.scss";
import Input from "../../components/FormComponents/Input";
import TextArea from "../../components/FormComponents/TextArea";
import toastContainer from "../../services/toastContainer";
import Logo from "../../components/Logo";

interface Todos {
  title: string;
  body: string;
  _id: string;
}

socket.on("addNewTodo", (data: Todos) => {
  toastContainer(
    `Aviso criado com sucesso!`,
    "success"
  );
});

socket.on("deleteTodo", (data: Todos) => {
  toastContainer(
    `Aviso deletado com sucesso!`,
    "warning"
  );
});

socket.on("login", (data: Todos) => {
  toastContainer(
    `${data} logado!`,
    "success"
  );
});

socket.on("connect", () => {
  console.clear();
});

async function getTodos(setTodos: any) {
  const { data } = await api.get("/messanges");
  setTodos(data);
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [isShowError, setIsShowError] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
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
          });

          setTodos([...todos, dataApi]);
          toastContainer(
            `Aviso \"${dataApi.title}\" criada com sucesso!`,
            "success"
          );
          socket.emit("addNewTodo", "addNewTodo");
          reset();

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

  return (
    <>
      <button
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
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "-50px",
          marginTop: "20px",
        }}
      >
        <Logo />
      </div>
      <header className={styles.header}>
        <h1>Cadastrar novo aviso</h1>
      </header>
      <main className={styles.main}>
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
        <div className={styles.avisos}>
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
            {todos.map(({ title, body, _id }, i) => (
              <motion.div
                key={_id}
                className={styles.avisosItem}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                exit={{ opacity: 0, y: 50 }}
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
                        "<br />"
                      ),
                  }}
                ></p>

                <div className={styles.avisosItemFooter}>
                  <button
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
