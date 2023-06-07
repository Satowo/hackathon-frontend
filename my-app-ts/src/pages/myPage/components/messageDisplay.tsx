import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuEdit } from "react-icons/lu";


type Message = {
  messageId: string;
  userId: string;
  userName: string;
  channelId: string;
  messageContent: string;
  edited: boolean;
};

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

type MessageDisplayProps = {
  message: Message;
  userInfo: User | undefined;
  onClickEdit: (messageId: Message) => void;
  onClickDelete: (message: Message) => Promise<void>;
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, userInfo, onClickEdit, onClickDelete}) => {
  const onClick = () => {
    onClickEdit(message);
  }; 

  const _onClick = () => {
    onClickDelete(message);
  };

  return (
    <div className="flex">
        <div className="w-12 h-11 rounded-full flex-shrink-0 mr-2">
          <img
            className="w-full h-full rounded-full"
            src={`https://knsoza1.com/wp-content/uploads/2020/07/8d27ad3552fd86901f4976429ad22ce2.png`}
            alt=""
          />
        </div>
        <div className="bg-gray-200 rounded-lg p-2 m-2 flex items-center">
          <div className="header">
            <p className="font-bold">{message.userName}</p>
            <div className="flex">
              {!(message.userId===userInfo?.userId) ? null : (
                <div>
                  <button type="button" className="text-gray-700 hover:bg-opacity-40" onClick={onClick}>
                    <LuEdit/>
                  </button>
                  <button type="button" className="bg-gray-200 text-red-500 rounded-lg hover:bg-opacity-50" onClick={_onClick}>
                    <FaRegTrashAlt/>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <p>{message.messageContent}</p>
            {!message.edited ? null : (<p className="text-gray-600 opacity-50">(編集済み)</p> )}
          </div>
        </div>
    </div>
  );
};

export default MessageDisplay;
