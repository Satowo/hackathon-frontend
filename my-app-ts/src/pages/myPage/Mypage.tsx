import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import MessageDisplay from "./components/messageDisplay";
/* import MessageForm from "./channel1/messageForm"; */
import { useNavigate, Navigate } from "react-router-dom";
import ChannelDisplay from "./components/channelDisplay";

const Mypage = () => {
  type User = {
    userId: string;
    userName: string;
    email: string;
    channels: Channel[];
  };

  type Channel = {
    channelId: string;
    channelName: string;
  };

  type Message = {
    messageId: string;
    userName: string;
    channelId: string;
    messageContent: string;
    edited: boolean
  };

  /* const backEndURL = "http://localhost:8080" */
  const backEndURL = "https://hackathon-backend-ipy2xx7l4q-uc.a.run.app"

  const [user, setUser] = useState<any>();
  const [userInfo, setUserInfo] = useState<User>();
  const [messagesData, setMessagesData] = useState<Message[]>([]);   //messageの全データをstateに設定
  const [loading, setLoading] = useState(true);                      //最初にloading出したいのでtrue
  const [_loading, _setLoading] = useState(true);                    //最初にloading出したいのでtrue


  //はじめにuserがログインしているか確認、していればそのuser情報をuserに入れる
  useEffect(() =>  {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      fetchUserInfo(backEndURL, currentUser?.email)
    });
  }, []);

  //ログインしているユーザーのemailからユーザー情報を取得する関数
  const fetchUserInfo = async (backEndURL: string, email: string | null | undefined) =>  {
    try {
        const res = await fetch(
            `${backEndURL+"/user?email="+email}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!res.ok) {
            throw Error(`Failed to fetch users: ${res.status}`);
        }

        console.log("response is ...", res);
        const _userInfo = await res.json()
        setUserInfo(_userInfo)
    } catch (err) {
        console.error(err);
    }
};

  //これはチャンネルのmessageをはじめに取ってくる機能用、余裕があれば実装
 /*  useEffect(() => {
    fetchMessages(userInfo?.inChannels);
  }, []); */

  const navigate = useNavigate();
  
  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  };

  //channelIdからそのチャンネル内のメッセージをすべて取得する関数
  /* const fetchMessages = async (channelId: string) => {
    const queryParameter = `/message?channelId=${channelId}`
    let res: Message[] = await fetchData(backEndURL, queryParameter);
    setMessagesData(res)
    _setLoading(false);
  }; */

  const getMessages = async (channelId: string) =>  {
    try {
        const res = await fetch(
            `${backEndURL+"/message?channelId="+channelId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (!res.ok) {
            throw Error(`Failed to fetch users: ${res.status}`);
        }

        console.log("response is ...", res);
        const messagesData = await res.json()
        setMessagesData(messagesData)
        _setLoading(false)
    } catch (err) {
        console.error(err);
    }
};



  //onSubmit時にPOSTリクエストを送りuserのデータを更新
 /*  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, channelId: string, messageContent:string) => {
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
              channelId: userInfo?.channels[0].channelId,
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
  }; */

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
                <div className="userName">
                  {userInfo?.userName}
                </div>
                <p className="email">{userInfo?.email}</p>
                <div className="channels-display">
                  {userInfo?.channels.map((channel: Channel) => {
                    return <ChannelDisplay channel={channel} getMessages={getMessages}/>;
                  })}
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
                    return <MessageDisplay message={message}/>;
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