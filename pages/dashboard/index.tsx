import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Form } from "@unform/web";
import * as Yup from "yup";

import api from "../../services/api";

import styles from "../../styles/Dashboard.module.scss";
import { FormHandles } from "@unform/core";
import Input from "../../components/FormComponents/Input";
import TextArea from "../../components/FormComponents/TextArea";

interface Todos {
  title: string;
  body: string;
  _id: string;
}

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);
  const [isShowError, setIsShowError] = useState(false);
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    async function getTodos() {
      const { data } = await api.get("/messanges");
      setTodos(data);
      console.log(data);
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
    // if (!title || !body) {
    //   formRef.current?.setErrors({
    //     title: "Title é obrigatório",
    //     body: "A descrição é obrigatória",
    //   });
    //   setIsShowError(true);
    //   setTimeout(() => {
    //     setIsShowError(false);
    //   }, 3000);
    //   return toast.error("Preencha todos os campos", {
    //     theme: "dark",
    //   });
    // }

    try {
      const schema = Yup.object().shape({
        title: Yup.string().required("O título é obrigatório"),
        body: Yup.string().required("A descrição é obrigatória"),
      });
      
      await schema.validate(data, {
        abortEarly: false,
      });

      const { data: dataApi } = await api.post("/messanges", {
        title,
        body,
      });

      setTodos([...todos, dataApi]);
      setTitle("");
      setBody("");
      toast.success(`Aviso \"${dataApi.title}\" criada com sucesso!`, {
        theme: "dark",
      });
      reset();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages: { [key: string]: string } = {};

        error.inner.forEach((err) => {
          errorMessages[err.path || 0] = err.message;
        });

        formRef.current?.setErrors(errorMessages);
        
        toast.error(error.inner.length > 1 ? "Preenccha todos os campos" : error.message, {
          theme: "dark",
        });
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
      toast.error("Internal Server Error", {
        theme: "dark",
      });
    }
  }

  return (
    <>
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

          <div className={styles.formFooter}>
            <button className={styles.btn}>Cadastrar</button>
          </div>
        </Form>
      </main>
      {!!todos.length && (
        <div className={styles.avisos}>
          <h1>Avisos</h1>
          <div className={styles.searchTitle}>
            <input
              type="text"
              placeholder="Pesquisar por título"
              onChange={async (e) => {
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
                    ? toast.error("Nenhum aviso encontrado", {
                        theme: "dark",
                      })
                    : null;
                }

                setTodos(filtered);
              }}
            />
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
