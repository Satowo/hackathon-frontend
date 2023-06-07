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
    <div className="flex items-start mb-2">
        <div className="w-10 h-10 rounded-full flex-shrink-0 mr-2">
          <img
            className="w-full h-full rounded-full"
            src={`https://knsoza1.com/wp-content/uploads/2020/07/8d27ad3552fd86901f4976429ad22ce2.png`}
            alt=""
          />
        </div>
        <div className="bg-gray-200 rounded-lg p-2">
          <p className="font-bold">{message.userName}</p>
          <button type="button" onClick={onClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
              <path d="M16 5l3 3" />
            </svg>
          </button>
          <p>{message.messageContent}{!message.edited ? "" : "（編集済み）" }</p>
        </div>
    </div>
  );
};

export default MessageDisplay;
