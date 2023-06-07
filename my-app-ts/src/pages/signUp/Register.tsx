import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate, Link } from "react-router-dom";

const Register = () => {
  const [registerUserName, setRegisterUserName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!registerUserName) {
      alert("名前を入力してください");
      return;
    }

    if (registerUserName.length > 10) {
      alert("名前は10文字以下にしてください");
      return;
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      const res = await fetch("https://hackathon-backend-ipy2xx7l4q-uc.a.run.app/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: registerUserName,
          email: registerEmail,
          password: registerPassword
        }),
      });

      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
      alert("正しく入力してください");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">新規登録</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">ユーザーネーム</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="user_name"
                type="text"
                value={registerUserName}
                onChange={(e) => setRegisterUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">メールアドレス</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">パスワード</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Sign Up
            </button>
            <p className="text-center">
              ログインは<Link to={`/login/`} className="text-blue-500">こちら</Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
