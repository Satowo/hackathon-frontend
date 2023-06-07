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
      <div className="channel w-full hover:bg-opacity-50">
        <button
          type="button"
          className="bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 font-semibold py-2 rounded-lg"
          onClick={onClick}
        >
          {"#  "+channel.channelName}
        </button>
      </div>
    </div>
  );
};

export default ChannelDisplay;
