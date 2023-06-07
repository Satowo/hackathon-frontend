import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../../firebase";
import { Navigate, Link } from "react-router-dom";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
    } catch (error) {
      alert("メールアドレスまたはパスワードが間違っています");
    }
  };

  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  });

  return (
    <div className="flex items-center justify-center h-screen bg-purple-900">
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <div className="max-w-2xl p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">ログイン</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">メールアドレス</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1">パスワード</label>
              <input
                className="w-full border rounded-lg px-4 py-2"
                name="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg">
              ログイン
            </button>
            <p className="text-center">
              新規登録は<Link to={`/register/`} className="text-blue-500 hover:text-blue-300">こちら</Link>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;

//test