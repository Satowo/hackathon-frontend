import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate, Link } from "react-router-dom";
import type { User } from '@firebase/auth'

const Register = () => {
  const [registerUserName, setRegisterUserName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState<User | null>();
  const [allUsersName, setAllUsersName] = useState<string[]>([]);

  /* const backEndURL = "http://localhost:8080" */
  const backEndURL = "https://hackathon-backend-ipy2xx7l4q-uc.a.run.app"

  useEffect(() => {
    getAllAppUsersName();
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const getAllAppUsersName = async () =>  {
    try {
        const res = await fetch(
            `${backEndURL+"/allUsers"}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!res.ok) {
            throw Error(`Failed to fetch userInfo: ${res.status}`);
        }

        console.log("response is ...", res);
        const _allUsersName: string[] = await res.json();
        console.log(_allUsersName);
        setAllUsersName(_allUsersName);
        return _allUsersName
    } catch (err) {
        console.error(err);
    }
  };

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

    if (registerPassword.length < 6) {
      alert("パスワードが短すぎます");
      return;
    }

    if (registerPassword.length > 30) {
      alert("パスワードが長すぎます");
      return;
    }

    // Check if username or email already exists
    const exists = allUsersName.find(name => name === registerUserName);
    if (exists) {
      alert("このユーザーネームはすでに使われています")
      return
    }

    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );

      const res = await fetch(backEndURL+"/user", {
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
        setUser(undefined);
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
      alert("正しく入力してください");
      setUser(undefined);
    }
  };


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-900 to-green-500">
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <div className="w-1/3 p-6 bg-gray-100 rounded-lg shadow-md ">
          <h1 className="text-2xl font-bold mb-6">新規登録</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">ユーザーネーム</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="user_name"
                type="text"
                value={registerUserName}
                onChange={(e) => setRegisterUserName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">メールアドレス</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">パスワード</label>
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-xl"
            >
              サインアップ
            </button>
            <p className="text-center">
              ログインは<Link to={`/login/`} className="text-blue-500 hover:text-blue-300">こちら</Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Register;
