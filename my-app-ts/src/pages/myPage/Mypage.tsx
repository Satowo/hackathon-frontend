import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import LoadingSpinner from "./components/lodingSpinner"; 
import MessageDisplay from "./components/messageDisplay";
import MessageForm from "./components/messageForm";
import ChannelDisplay from "./components/channelDisplay";
import ChannelMembersDisplay from "./components/channelMembersDisplay";
import {FaUser} from "react-icons/fa";
import {BiPlus} from "react-icons/bi";
import ChannelHeader from "./components/channelHeader";

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
 /*  const [inChannel, setInChannel] = useState(true);                 */                          //一つでもチャンネルに所属しているかどうかをstateに設定
  const [inChannelsDisplay, setInChannelsDisplay] = useState(true);                                //チャンネル一覧を表示しているかどうかをstateに設定
  const [allChannelsDisplay, setAllChannelsDisplay] = useState(true); 
  const [channelsData, setChannelsData] = useState<Channel[]>([]);                                 //channelの全データをstateに設定
  const [messagesData, setMessagesData] = useState<Message[]>([]);                                 //messageの全データをstateに設定
  const [defaultMessage, setDefaultMessage] = useState("");                                        //デフォルトのmessage入力欄の内容をstateに設定
  const [message, setMessage] = useState<Message>();                                               //userが今表示しているメッセージをstateに設定。
  const [nowChannel, setChannel] = useState<Channel | undefined>(userInfo?.channels[0]);           //userが今表示しているチャンネルをstateに設定
  const [channelMembersDisplay, setChannelMembersDisplay] = useState(false);
  const [channelMembers, setChannelMembers] = useState<User[]>();                                  //userが今表示しているチャンネルのチャンネルメンバーをstateに設定
  const [loading, setLoading] = useState(true);                                                    //最初にloading出したいのでtrue
  const [_loading, _setLoading] = useState(true);                                                  //最初に_loading出したいのでtrue


  //はじめにuserがログインしているか確認、していればそのuser情報をuserに入れる関数
  useEffect(() =>  {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log(currentUser?.email);
      if (currentUser != null ) {
        getUserInfo(backEndURL, currentUser?.email).then((userInfo: User) => {
          getMessages(userInfo?.channels[0]);
          setChannel(userInfo?.channels[0]);
      });
      }
    });
  }, []);

  //他のURLへ移動する関数
  const navigate = useNavigate();
  
  //logout時にログイン画面に飛ぶ関数
  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  };

  //ログインしているユーザーのemailからユーザー情報を取得
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
        const _userInfo = await res.json();
        console.log(_userInfo);
        setUserInfo(_userInfo)
        return _userInfo
    } catch (err) {
        console.error(err);
    }
  };

  //channelIdからそのチャンネル内のメッセージをすべて取得
  const getMessages = async (channel: Channel | undefined) =>  {
    _setLoading(true);
    setChannelMembersDisplay(false);

    if (channel != undefined){
      try {
        const res = await fetch(
            `${backEndURL+"/message?channelId="+channel?.channelId}`,
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
        console.log(messagesData);
        setMessagesData(messagesData);
        setChannel(channel);
        _setLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    else {
      _setLoading(false);
    }
  };

  //チャンネルメンバーボタンを押すとchannelIdからそのチャンネル内のメンバーをすべて取得
  const getChannelMembers = async (channel: Channel | undefined) =>  {
    if (channel != undefined){
      try {
        const res = await fetch(
            `${backEndURL+"/channel_member?channelId="+channel?.channelId}`,
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
        const Members = await res.json();
        setChannelMembers(Members);
        setChannelMembersDisplay(!channelMembersDisplay);
        setChannel(channel);
        _setLoading(false);
      } catch (err) {
          console.error(err);
      }
    }
    else{
      return
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
              channelId: nowChannel?.channelId,
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
              channelId: nowChannel?.channelId,
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

  //メッセージの編集ボタンを押すとmessageIdのstateをそのメッセージのものに変更
  const onClickEdit = (message: Message) => {
    setMessage(message);
    setDefaultMessage(message.messageContent)
    console.log(defaultMessage)
  };

  //メッセージのゴミ箱ボタンを押して削除するを選択するとそのメッセージを削除
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
              channelId: message?.channelId,
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

  //チャンネルボタンを押すと自分が入っているチャンネルを表示/非表示を切り替え
  const _setChannelsDisplay: React.MouseEventHandler<HTMLButtonElement> | undefined = () => {
    setInChannelsDisplay(!inChannelsDisplay);
  };

  //プラスボタンを押すと全チャンネルを取得する関数 
  const getAllChannels: React.MouseEventHandler<HTMLButtonElement> = async () =>  {
    try {
        const res = await fetch(
            `${backEndURL+"/channel"}`,
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
        const allChannels = await res.json();
        console.log(allChannels);
        setChannelsData(allChannels);
        setAllChannelsDisplay(!allChannelsDisplay);
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
          <div className="static w-screen h-screen">
            <div className="w-1/5 h-screen fixed left-0 bg-purple-900 py-8">
              <h1 className="text-lg text-gray-300 text-opacity-100 font-bold mb-3 pb-4 border-b border-purple-700">
                UTokyo Tech Club
              </h1>
              <div className="flex flex-col items-center">
                <div className="flex w-3/4 h-20 mb-3">
                  <div className="flex-1 flex items-center justify-center text-blue-200 text-6xl">
                    <FaUser/>
                  </div>
                  <p className="flex-1 flex items-center justify-center text-auto font-semibold text-gray-300">
                    {userInfo?.userName}
                  </p>
                </div>
                <div className="flex w-3/4 h-10 mb-3 space-x-2">
                  <button type="button" className="flex w-2/3 flex items-center justify-center 
                    bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 
                    font-semibold rounded-lg" onClick={_setChannelsDisplay}
                    >
                    マイチャンネル
                  </button>
                  <button type="button" className="flex w-1/3 flex items-center justify-center 
                    bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 
                    text-2xl font-semibold rounded-lg" onClick={getAllChannels}
                    >
                    <BiPlus/>
                  </button>
                </div>
                {!inChannelsDisplay ? null : (
                  <div className="w-3/4 space-y-2 mb-6">
                    {userInfo?.channels.map((channel: Channel | undefined) => (
                      <ChannelDisplay key={channel?.channelId} channel={channel} getMessages={getMessages} nowChannel={nowChannel}/>
                    ))}
                  </div>
                )}
                {!allChannelsDisplay ? null : (
                  <div className="w-3/4 space-y-2 mb-6">
                    <p className="p-2 text-gray-300 text-opacity-70 font-semibold border-b border-purple-700">
                      参加可能なチャンネル
                    </p>
                    {channelsData.filter((channel: Channel) => 
                      !userInfo?.channels.some(userChannel => userChannel.channelId === channel.channelId)
                    ).map((filteredChannel: Channel) => (
                      <ChannelDisplay key={filteredChannel.channelId} channel={filteredChannel} getMessages={getMessages} nowChannel={nowChannel}/>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="w-4/5 h-screen">
              <div className="w-4/5 h-16 fixed top-0 right-0">
                <ChannelHeader logout={logout} nowChannel={nowChannel} 
                getChannelMembers={getChannelMembers} getMessages={getMessages} channelMembersDisplay={channelMembersDisplay} />
              </div>
              <div className="flex-column">
                {_loading ? (
                  <div className="w-4/5 absolute right-0">
                    <LoadingSpinner/>
                  </div>
                ) : (
                  <div>
                    <div className="w-4/5 absolute top-16 bottom-44 right-0 overflow-y-auto">
                      <div className="w-full">
                      {messagesData?.map((message: Message) => (
                        <MessageDisplay key={message.messageId} message={message} userInfo={userInfo} onClickEdit={onClickEdit} onClickDelete={onClickDelete}/>
                      ))}
                      </div>
                    </div>
                    <div>
                      {!channelMembersDisplay ? null : (
                      <div className="w-1/5 absolute top-16 right-0 bg-white border-y border-b border-gray-300 rounded-xl shadow-lg">
                        <p className="text-lg font-semibold">チャンネルメンバー</p>
                        {channelMembers?.map((member: User) => (
                            <ChannelMembersDisplay key={member.userId} member={member}/>
                          ))}
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
              <div className="w-4/5 h-44 fixed bottom-0 right-0">
                {userInfo && (
                  <MessageForm onSubmit={onSubmit} onSubmitEdit={onSubmitEdit} userName={userInfo.userName} defaultMessage={defaultMessage} />
                )}
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

