import { useState } from "react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Router from "next/router";
import { socket } from "../_app";

import users from "../../data/database.json";

import styles from "../../styles/Login.module.scss";

import toastContainer from "../../services/toastContainer";

import Logo from "../../components/Logo";

socket.on("connect", () => {
  ;
});

export default function Home() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(data: { username: string; pass: string }) {
    const { username, pass } = data;

    // verificar se o username e a senha são valores válidos
    if (username === "" || pass === "") {
      toastContainer("Preencha todos os campos", "error");
      return;
    }

    const user = users.find(
      (user) => user.username === username && user.pass === pass
    );

    if (user) {
      // salvar o usuário no localStorage
      localStorage.setItem("user", JSON.stringify({
        username: user.username,
        name: user.name,
        profile: user.profile,
      }));
      // redirecionar para a página de dashboard
      Router.push("/dashboard");
      // socket.emit("login", username);
      toastContainer("Login realizado com sucesso", "success");
    } else {
      toastContainer("Usuario ou senha incorretos", "error");
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Home</title>
      </Head>

      <div className="max-w-sm w-full space-y-8">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "-100px",
            gap: "50px",
          }}
        >
          <Logo />
          <h2 className="mt-0px text-center text-2xl font-extrabold text-gray-300">
            Faça login em sua conta
          </h2>
        </div>
        <form
          className="mt-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ username: user, pass: password });
          }}
        >
          {/* <input type="hidden" name="remember" defaultValue="true" /> */}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username-address" className="sr-only">
                Email address
              </label>
              <input
                // {...register("username")}
                style={{
                  backgroundColor: "#44475a",
                  color: "#f8f8f2",
                  borderBottom: ".5px solid #667eea",
                  borderTop: "1px solid #667eea",
                  borderLeft: "1px solid #667eea",
                  borderRight: "1px solid #667eea",
                }}
                id="username-address"
                name="username"
                type="username"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                autoComplete="username"
                className={`${styles.input} appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="pass" className="sr-only">
                Password
              </label>
              <input
                // {...register("pass")}
                style={{
                  backgroundColor: "#44475a",
                  color: "#f8f8f2",
                  borderBottom: "1px solid #667eea",
                  borderTop: "1px solid #667eea",
                  borderLeft: "1px solid #667eea",
                  borderRight: ".5px solid #667eea",
                }}
                id="pass"
                name="pass"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                autoComplete="current-pass"
                className={`${styles.input} appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
            </div>
          </div>

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div> */}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// export async function getStaticProps(context: GetStaticProps) {
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }