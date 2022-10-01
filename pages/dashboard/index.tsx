import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Form } from "@unform/web";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import api from "../../services/api";

import styles from "../../styles/Dashboard.module.scss";
import Input from "../../components/FormComponents/Input";
import TextArea from "../../components/FormComponents/TextArea";
import toastContainer from "../../services/toastContainer";

interface Todos {
  title: string;
  body: string;
  _id: string;
}

export default function Dashboard() {
  const [todos, setTodos] = useState<Todos[]>([]);
  const [isShowError, setIsShowError] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getTodos() {
      const { data } = await api.get("/messanges");
      setTodos(data);
    }

    getTodos();
  }, []);

  async function handleSubmit(
    data: {
      title: string;
      body: string;
    },
    { reset }: { reset: () => void }
  ) {
    try {
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
      const { data } = await api.delete(`/messange/${id}`);

      setTodos(todos.filter((todo) => todo._id !== id));
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
      <Head>
        <title>Dashboard</title>
      </Head>
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
