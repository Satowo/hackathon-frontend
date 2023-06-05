import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import MessageDisplay from "./channel1/messageDisplay";
import {
  useNavigate,
  Navigate
} from "react-router-dom";
import { fetchData } from "../../utils/FetchData";

const Mypage = () => {
  type Message = {
    message_id: string;
    user_name: string;
    channel_id: string;
    message_content: string;
    edited: boolean
  }

  const channelId = "00000000000000000000000001"

  /* const initialURL = `http://localhost:8080/message?channel_id=${channelId}`; */
  const initialURL = `https://hackathon-backend-ipy2xx7l4q-uc.a.run.app/message?channel_id=${channelId}`; //endpoint
  const [messagesData, setMessagesData] = useState<Message[]>([]);//messageの全データをstateに設定
  const [user, setUser] = useState<any>(undefined);
  const [loading, setLoading] = useState(true);//最初にloading出したいのでtrue
  const [_loading, _setLoading] = useState(true);//最初にloading出したいのでtrue

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }

  //これはチャンネルのmessageをはじめに取ってくる機能用、余裕があれば実装
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    let res: Message[] = await fetchData(initialURL);
    setMessagesData(res)
    _setLoading(false);
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
                  <p className="loader">ロード中。。。</p>
                  ) : (
                  <div>
                  {messagesData?.map((message: Message) => {
                    return <MessageDisplay message={message} />;
                  })}
                  </div>
                  )}
                </div>
                <div className="input-form">
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mypage;