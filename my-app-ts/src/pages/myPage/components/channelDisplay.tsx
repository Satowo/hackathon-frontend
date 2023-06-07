import React from "react";

type Channel = {
  channelId: string;
  channelName: string;
};

type ChannelDisplayProps = {
  channel: Channel;
  getMessages: (channelId: string) => Promise<void>;
};

const ChannelDisplay: React.FC<ChannelDisplayProps> = ({
  channel,
  getMessages,
}) => {
  const onClick = () => {
    getMessages(channel.channelId);
  };

  return (
    <div className="messageDisplay">
      <div className="message">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          onClick={onClick}
        >
          {channel.channelName}
        </button>
      </div>
    </div>
  );
};

export default ChannelDisplay;
