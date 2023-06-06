import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import MessageDisplay from "./channel1/messageDisplay";
/* import MessageForm from "./channel1/messageForm"; */
import {
  useNavigate,
  Navigate
} from "react-router-dom";
import { fetchData } from "../../utils/FetchData";

const Mypage = () => {
  type User = {
    userId: string;
    userName: string;
    email: string;
    inChannels: string[];
  }

  type Channel = {
    channelId: string;
    channelName: string;
  }

  type Message = {
    messageId: string;
    userName: string;
    channelId: string;
    messageContent: string;
    edited: boolean
  }

  /* const backEndURL = "http://localhost:8080" */
  const backEndURL = "https://hackathon-backend-ipy2xx7l4q-uc.a.run.app"

  const [user, setUser] = useState<any>(undefined);
  const [userInfo, setUserInfo] = useState<User>()
  const [messagesData, setMessagesData] = useState<Message[]>([]);//messageの全データをstateに設定
  const [loading, setLoading] = useState(true);//最初にloading出したいのでtrue
  const [_loading, _setLoading] = useState(true);//最初にloading出したいのでtrue


  //はじめにuserがログインしているか確認、していればそのuser情報をuserに入れる
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log(user?.email)
      let userInfoRes: User = await fetchUserInfo(user?.email)
      setUserInfo(userInfoRes)
      setLoading(false);
    });
  }, []);

  //これはチャンネルのmessageをはじめに取ってくる機能用、余裕があれば実装
  /* useEffect(() => {
    fetchMessages();
  }, []); */


  //ログインしているユーザーのemailからユーザー情報を取得する関数
  const fetchUserInfo = (email: string) => {
    const queryParameter = `/user?email=${email}`
    let userInfoRes: any = fetchData(backEndURL, queryParameter)
    return userInfoRes
  }

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }

  //channelIdからそのチャンネル内のメッセージをすべて取得する関数
  const fetchMessages = async (channelId: string) => {
    const queryParameter = `/message?channelId=${channelId}`
    let res: Message[] = await fetchData(backEndURL, queryParameter);
    setMessagesData(res)
    _setLoading(false);
  };

  //onSubmit時にPOSTリクエストを送りuserのデータを更新
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, messageContent:string) => {
    e.preventDefault();

    if (!messageContent) {
      alert("メッセージを入力してください");
      return;
    }

    if (messageContent.length > 500) {
      alert("メッセージは500文字以内にしてください");
      return;
    }

    try {
      const res = await fetch(
          backEndURL+"/message",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userInfo?.userId,
              channelId: userInfo?.inChannels,
              messageContent: messageContent
            }),
          }
      );
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      const messagesData_: Message[] = await res.json();
      setMessagesData(messagesData_);
      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {!loading && (
        <div>
          {!user ? (
            <Navigate to={`/login/`} />
          ) : (
            <div className="my-page">
              <div className="side-bar">
                <h1>マイページ</h1>
                <div className="account-info">
                  <p>{user?.email}</p>
                </div>
                <div className="channels-display">
                </div>
              </div>
              <div className="main-display">
                <div className="channel-header">
                  <button onClick={logout}>ログアウト</button>
                </div>
                <div className="messages-display">
                  {_loading ? (
                  <p className="loader">ロード中...</p>
                  ) : (
                  <div>
                  {messagesData?.map((message: Message) => {
                    return <MessageDisplay message={message} />;
                  })}
                  </div>
                  )}
                </div>
                {/* <MessageForm props={props}/> */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mypage;