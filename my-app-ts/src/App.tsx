import { useEffect, useState } from "react";
import './App.css';
import Form from './components/Form';
import UsersDisplay from "./components/usersDisplay";
import { fetchUsers } from "./utils/FetchUsers";

function App() {
  //userの型定義
  type User = {
    id: string;
    name: string;
    age: number;
  }

  const initialURL = "http://localhost:8000/user"; //endpoint
  const [loading, setLoading] = useState<Boolean>(true); //最初にloading出したいのでtrue
  const [usersData, setUsersData] = useState<User[]>([]);//userの全データをstateに設定

  console.log(typeof(usersData))

  //reactアプリ立ち上げ時にuserデータを取得
  useEffect(() => {
    fetchUsers_();
  }, []);

  // すべてのuserデータを取得
  const fetchUsers_ = async () => {
    let res: User[] = await fetchUsers(initialURL);
    setUsersData(res)
    setLoading(false);
  };

  //onSubmit時にPOSTリクエストを送りuserのデータを更新
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, name: string, age: number) => {
    e.preventDefault();

    if (!name) {
      alert("Please enter name");
      return;
    }

    if (name.length > 50) {
      alert("Please enter a name shorter than 50 characters");
      return;
    }

    if (age < 20 || age > 80) {
      alert("Please enter age between 20 and 80");
      return;
    }

    try {
      const res = await fetch(
          "http://localhost:8000/user",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              age: age
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
      <div className='App'>
        <header className='App-header'>
          <h2 className='header-string'>User Register</h2>
        </header>
        <Form onSubmit={onSubmit}/>
        <div className='users-display'>
          {loading ? (
              <p className="loader">ロード中。。。</p>
          ) : (
              <div>
                {usersData?.map((user: User) => {
                  return <UsersDisplay user={user} />;
                })}
              </div>
          )}
        </div>
      </div>
  );
}

export default App;
