import React from "react";

type Message = {
  messageId: string;
  userName: string;
  channelId: string;
  messageContent: string;
  edited: boolean;
};

type MessageDisplayProps = {
  message: Message;
  onClickEdit: (messageId: Message) => void;
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, onClickEdit}) => {
  const onClick = () => {
    onClickEdit(message);
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
          <p className="font-bold">{message.userName}</p>
          <p>{message.messageContent}{!message.edited ? "" : "（編集済み）" }</p>
          <button type="button" className="" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="25" height="25" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
              <path d="M16 5l3 3" />
            </svg>
          </button>
        </div>
    </div>
  );
};

export default MessageDisplay;
