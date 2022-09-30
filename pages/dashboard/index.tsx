import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import api from "../../services/api";

import styles from "../../styles/Dashboard.module.scss";

interface Todos {
  title: string;
  body: string; 
  _id: string;
}

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [todos, setTodos] = useState<Todos[]>([]);

  useEffect(() => { 
    async function getTodos() {
      const { data } = await api.get("/messanges");
      setTodos(data);
      console.log(data);
    }

    getTodos();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const { data } = await api.post("/messanges", {
        title,
        body,
      });

      setTodos([...todos, data]);
      setTitle("");
      setBody("");
      toast.success("Mensagem criada com sucesso!", {
        theme: "dark",
      });
    } catch (error) {
      toast.error("Erro ao criar mensagem!", {
        theme: "dark",
      });
    }
  }

  async function handleDelete(id: string) {
    try {
      await api.delete(`/messange/${id}`);

    setTodos(todos.filter((todo) => todo._id !== id));
    toast.success("Mensagem deletada com sucesso!", {
      theme: "dark",
    });
    } catch {
      toast.error("Erro ao deletar mensagem!", {
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <fieldset
            className={`
              ${styles.formFieldset}
              ${styles.uiInput}
              ${styles.__first}
            `}
          >
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              id="username"
              value={title}
              tabIndex={0}
              placeholder="Digite o título"
            />
            <label htmlFor="username">
              <span data-text="Titulo">Titulo</span>
            </label>
          </fieldset>

          <fieldset
            className={`
              ${styles.formFieldset}
              ${styles.uiInput}
              ${styles.__second}
            `}
          >
            <textarea
              id="email"
              tabIndex={0}
              onChange={(e) => setBody(e.target.value)}
              value={body}
              placeholder="Digite a descrição"
            />
            <label htmlFor="email">
              <span data-text="Descrição">Descrição</span>
            </label>
          </fieldset>

          <div className={styles.formFooter}>
            <button className={styles.btn}>Cadastrar</button>
          </div>
        </form>
      </main>
      {!!todos.length && <div className={styles.avisos}>
        <h1>Avisos</h1>
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
      </div>}
    </>
  );
}
