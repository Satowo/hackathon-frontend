import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { LuEdit } from "react-icons/lu";
import { FaUser } from "react-icons/fa";

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
    <div className="py-3 w-full border">
      <div className="flex w-full p-2 space-x-2 hover:bg-gray-200 rounded-lg">
        <div className="p-1 text-purple-800 text-4xl">
          <FaUser/>
        </div>
        <div className="flex-column w-full">
          <div className="flex">
            <p className="w-5/6 text-left font-bold py-1">{message.userName}</p>
            {!(message.userId===userInfo?.userId) ? null : (
              <div className="w-1/6 pb-1">
                <button type="button" className="text-gray-700 rounded-lg hover:bg-gray-500 hover:bg-opacity-50" onClick={onClick}>
                  <LuEdit/>
                </button>
                <button type="button" className="text-red-500 rounded-lg hover:bg-gray-500 hover:bg-opacity-50" onClick={_onClick}>
                  <FaRegTrashAlt/>
                </button>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <p className="text-left">{message.messageContent}</p>
            {!message.edited ? null : (<p className="text-gray-600 opacity-50">(編集済み)</p> )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
