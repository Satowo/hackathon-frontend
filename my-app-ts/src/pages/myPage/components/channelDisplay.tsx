import React from "react";

type Channel = {
  channelId: string;
  channelName: string;
};

type ChannelDisplayProps = {
  channel: Channel | undefined;
  getMessages: (channel: Channel | undefined) => Promise<void>;
};

const ChannelDisplay: React.FC<ChannelDisplayProps> = ({channel, getMessages,}) => {
  const onClick = () => {
    getMessages(channel);
  };

  return (
    <div className="w-full">
        <button
          type="button"
          className="w-full bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 font-semibold rounded-lg"
          onClick={onClick}
        >
          <div className="flex items-center">
            <p className="w-1/4 text-xl">#</p>
            <p className="w-3/4">{channel?.channelName}</p>
          </div>
        </button>
    </div>
  );
};

export default ChannelDisplay;
