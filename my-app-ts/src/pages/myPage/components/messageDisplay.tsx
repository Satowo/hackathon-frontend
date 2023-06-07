import React from "react";

type Message = {
  messageId: string;
  userName: string;
  channelId: string;
  messageContent: string;
  edited: boolean;
};

const MessageDisplay = ({ message }: { message: Message }) => {
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
          <p>{message.messageContent}</p>
        </div>
    </div>
  );
};

export default MessageDisplay;
