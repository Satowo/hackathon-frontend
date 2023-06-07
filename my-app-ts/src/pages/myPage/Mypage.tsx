import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import MessageDisplay from "./components/messageDisplay";
import MessageForm from "./components/messageForm";
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

  const backEndURL = "http://localhost:8080"
  /* const backEndURL = "https://hackathon-backend-ipy2xx7l4q-uc.a.run.app" */

  const [user, setUser] = useState<any>();
  const [userInfo, setUserInfo] = useState<User>();
  const [messagesData, setMessagesData] = useState<Message[]>([]);                                 //messageの全データをstateに設定
  const [defaultMessage, setDefaultMessage] = useState("");                                        //デフォルトのmessage入力欄の内容をstateに設定
  const [message, setMessage] = useState<Message>();                                               //userが今表示しているメッセージをstateに設定。
  const [channelId, setChannelId] = useState<string | undefined>(userInfo?.channels[0].channelId); //userが今表示しているチャンネルのchannelIdを設定。デフォルトは0番目
  const [loading, setLoading] = useState(true);                                                    //最初にloading出したいのでtrue
  const [_loading, _setLoading] = useState(true);                                                  //最初にloading出したいのでtrue


  //はじめにuserがログインしているか確認、していればそのuser情報をuserに入れる関数
  useEffect(() =>  {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      fetchUserInfo(backEndURL, currentUser?.email)
    });
  }, []);

  //他のURLへ移動する関数
  const navigate = useNavigate();
  
  //logout時にログイン画面に飛ぶ関数
  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  };

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

  //channelIdからそのチャンネル内のメッセージをすべて取得する関数
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
        const messagesData = await res.json();
        setMessagesData(messagesData);
        setChannelId(channelId);
        _setLoading(false);
    } catch (err) {
        console.error(err);
    }
  };

  //onSubmit時にPOSTリクエストを送りmessagesのデータを更新
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>, messageContent:string) => {
    e.preventDefault();

    if (!messageContent) {
      alert("メッセージを入力してください");
      return;
    };

    if (messageContent.length > 500) {
      alert("メッセージは500文字以内にしてください");
      return;
    };

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
              channelId: channelId,
              messageContent: messageContent
            }),
          }
      );
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      };

      const messagesData_: Message[] = await res.json();
      setMessagesData(messagesData_);
      setDefaultMessage("");
      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
    };
  };

  //onSubmitEdit時にPOSTリクエストを送りmessageを編集してmessagesのデータを更新
  const onSubmitEdit = async (e: React.FormEvent<HTMLFormElement>, messageContent:string) => {
    e.preventDefault();

    if (!messageContent) {
      alert("メッセージを入力してください");
      return;
    };

    if (messageContent.length > 500) {
      alert("メッセージは500文字以内にしてください");
      return;
    };

    try {
      const res = await fetch(
          backEndURL+"/message_edit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messageId: message?.messageId,
              channelId: channelId,
              messageContent: messageContent
            }),
          }
      );
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      };

      const messagesData_: Message[] = await res.json();
      setMessagesData(messagesData_);
      setDefaultMessage("");
      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
    };
  };

  //メッセージの編集ボタンを押すとmessageIdのstateをそのメッセージのものに変更する関数
  const onClickEdit = (message: Message) => {
    setMessage(message);
    setDefaultMessage(message.messageContent)
    console.log(defaultMessage)
  };

  return (
    <div>
      {!loading && (
        <div>
          {!user ? (
            <Navigate to={`/login/`} />
          ) : (
          <div className="myPage static">
            <div className="sideBar w-1/4 fixed bottom-0 left-0 top-0 bg-gray-200 px-4 py-8">
              <h1 className="text-2xl font-bold mb-4">マイページ</h1>
              <div className="userInfo mb-6">
                <p className="text-lg font-semibold">{userInfo?.userName}</p>
                <p className="text-sm text-gray-500">{userInfo?.email}</p>
              </div>
              <div className="logOut mb-6">
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                  onClick={logout}
                >
                  ログアウト
                </button>
              </div>
              <div className="channelDisplay space-y-2">
                {userInfo?.channels.map((channel: Channel) => (
                  <ChannelDisplay key={channel.channelId} channel={channel} getMessages={getMessages}/>
                ))}
              </div>
            </div>
            <div>
              {_loading ? (
                <p className="text-lg"></p>
              ) : (
              <div className="absolute flex right-0 w-3/4 h-2/3 overflow-y-auto">
                <div className="px-4 py-8 space-y-4">
                {messagesData?.map((message: Message) => (
                  <MessageDisplay key={message.messageId} message={message} onClickEdit={onClickEdit}/>
                ))}
                </div>
              </div>
              )}
              {userInfo && (
              <MessageForm onSubmit={onSubmit} onSubmitEdit={onSubmitEdit} userName={userInfo.userName} defaultMessage={defaultMessage} />
            )}
            </div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Mypage;