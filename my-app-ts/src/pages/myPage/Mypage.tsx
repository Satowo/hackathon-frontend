import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/lodingSpinner"; 
import MessageDisplay from "./components/messageDisplay";
import MessageForm from "./components/messageForm";
import ChannelDisplay from "./components/channelDisplay";
import {HiOutlineLogout} from "react-icons/hi";
import {FaUser} from "react-icons/fa";
import {BiPlus} from "react-icons/bi";
import { channel } from "diagnostics_channel";


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
    userId:string;
    userName: string;
    channelId: string;
    messageContent: string;
    edited: boolean
  };

  const backEndURL = "http://localhost:8080"
  /* const backEndURL = "https://hackathon-backend-ipy2xx7l4q-uc.a.run.app" */

  const [user, setUser] = useState<any>();
  const [userInfo, setUserInfo] = useState<User>();
  const [channelsDisplay, setChannelsDisplay] = useState(true);                                    //チャンネル一覧を表示しているかどうかをstateに設定
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
      console.log(currentUser?.email);
      getUserInfo(backEndURL, currentUser?.email).then((userInfo: User) => {
        setChannelId(userInfo.channels[0].channelId);
        getMessages(userInfo.channels[0].channelId);
      });
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
  const getUserInfo = async (backEndURL: string, email: string | null | undefined) =>  {
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
            throw Error(`Failed to fetch userInfo: ${res.status}`);
        }

        console.log("response is ...", res);
        const _userInfo = await res.json()
        setUserInfo(_userInfo)
        return _userInfo
    } catch (err) {
        console.error(err);
    }
    
  };

  //channelIdからそのチャンネル内のメッセージをすべて取得する関数
  const getMessages = async (channelId: string|undefined) =>  {
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
            throw Error(`Failed to fetch messages: ${res.status}`);
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

  //onSubmit時にPOSTリクエストを送りmessagesのデータを更新する関数
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
        throw Error(`Failed to fetch messages: ${res.status}`);
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
        throw Error(`Failed to fetch messages: ${res.status}`);
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

  //メッセージのゴミ箱ボタンを押して削除するを選択するとそのメッセージを削除する関数
  const onClickDelete = async (message: Message) => {
    try {
      const res = await fetch(
          backEndURL+"/message_delete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messageId: message?.messageId,
              channelId: channelId,
            }),
          }
      );
      if (!res.ok) {
        throw Error(`Failed to fetch messages: ${res.status}`);
      };

      const messagesData_: Message[] = await res.json();
      setMessagesData(messagesData_);
      setDefaultMessage("");
      console.log("response is ...", res);
    } catch (err) {
      console.error(err);
    };
  };

  //自分が入っているチャンネルを取得する関数
  const _setChannelsDisplay: React.MouseEventHandler<HTMLButtonElement> | undefined = () => {
    setChannelsDisplay(!channelsDisplay);
  };

  return (
    <div>
      {!loading && (
        <div>
          {!user ? (
              <Navigate to={`/login/`} />
          ) : (
          <div className="myPage static">
            <div className="sideBar w-1/4 fixed bottom-0 left-0 top-0 bg-purple-900 py-8">
              <h1 className="text-2xl text-white font-bold mb-3 pb-4 border-b border-purple-700">UTokyo Tech Club</h1>
              <div className="flex flex-col items-center">
                <div className="flex w-3/4 h-20 mb-3 border border-purple-700">
                  <div className="flex-1 flex items-center justify-center text-blue-200 text-6xl"><FaUser/></div>
                  <p className="flex-1 flex items-center justify-center text-xl font-semibold text-gray-300">{userInfo?.userName}</p>
                </div>
                <div className="flex w-3/4 h-10 mb-3 space-x-2 border border-purple-700">
                  <button type="button" className="flex w-2/3 flex items-center justify-center 
                    bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 
                    font-semibold rounded-lg" onClick={_setChannelsDisplay}
                    >
                    チャンネル
                  </button>
                  <button type="button" className="flex w-1/3 flex items-center justify-center 
                    bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 
                    text-2xl font-semibold rounded-lg"
                    >
                    <BiPlus/>
                  </button>
                </div>
                {!channelsDisplay ? null : (
                  <div className="w-3/4 space-y-2 mb-6 border border-purple-700">
                    {userInfo?.channels.map((channel: Channel) => (
                      <ChannelDisplay key={channel.channelId} channel={channel} getMessages={getMessages}/>
                    ))}
                  </div>
                )}
                <div className="logOut mb-8">
                  <button
                    className="bg-purple-900 hover:bg-purple-300 text-white text-2xl font-bold py-2 px-4 rounded-lg"
                    onClick={logout}
                  >
                    <HiOutlineLogout/>
                  </button>
                </div>
              </div>
            </div>
            <div>
              {_loading ? (
                <p className="text-lg"></p>
              ) : (
              <div className="absolute flex right-0 w-3/4 h-3/4 overflow-y-auto border border-gray-300">
                <div className="w-full">
                {messagesData?.map((message: Message) => (
                  <MessageDisplay key={message.messageId} message={message} userInfo={userInfo} onClickEdit={onClickEdit} onClickDelete={onClickDelete}/>
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

