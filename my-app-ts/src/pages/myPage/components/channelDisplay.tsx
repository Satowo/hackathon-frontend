import React from "react";

type Channel = {
  channelId: string;
  channelName: string;
};

type ChannelDisplayProps = {
  channel: Channel;
  getMessages: (channelId: string) => Promise<void>;
};

const ChannelDisplay: React.FC<ChannelDisplayProps> = ({channel, getMessages,}) => {
  const onClick = () => {
    getMessages(channel.channelId);
  };

  return (
    <div className="channelDisplay flex">
      <div className="channel w-full">
        <button
          type="button"
          className="bg-purple-800 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          onClick={onClick}
        >
          {channel.channelName}
        </button>
      </div>
    </div>
  );
};

export default ChannelDisplay;
