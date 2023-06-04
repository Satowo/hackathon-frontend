import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../../firebase";
/* 「Link」をimport↓ */
import { Navigate, Link } from "react-router-dom";



const Register = () => {
  type User = {
    userName: string;
    email: string;
    password: string;
  }

  const [registerUserName, setRegisterUserName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [usersData, setUsersData] = useState<User[]>([]);//userの全データをstateに設定
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  //onSubmit時にPOSTリクエストを送りuserのデータを更新
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
    } catch(error) {
      alert("正しく入力してください");
    }

    if (!registerUserName) {
      alert("Please enter name");
      return;
    }

    if (registerUserName.length > 10) {
      alert("Please enter a name shorter than 10 characters");
      return;
    }

    try {
      const res = await fetch(
          "http://localhost:8080/user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_name: registerUserName,
              email: registerEmail,
              password: registerPassword
            }),
          }
      );
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      const usersData_: User[] = await res.json();
      setUsersData(usersData_);
      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <>
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <>
          <h1>新規登録</h1>
          <form onSubmit={handleSubmit}>
          <div>
              <label>ユーザーネーム</label>
              <input
                name="user_name"
                type="text"
                value={registerUserName}
                onChange={(e) => setRegisterUserName(e.target.value)}
              />
            </div>
            <div>
              <label>メールアドレス</label>
              <input
                name="email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
            </div>
            <div>
              <label>パスワード</label>
              <input
                name="password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <button type={"submit"}>Sign Up</button>
            {/* ↓リンクを追加 */}
            <p>ログインは<Link to={`/login/`}>こちら</Link></p>
          </form>
        </>
      )}
    </>
  );
};

export default Register;