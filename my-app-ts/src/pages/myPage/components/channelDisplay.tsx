import { useState } from "react";



type Channel = {
  channelId: string;
  channelName: string;
};

type ChannelDisplayProps = {
  channel: Channel | undefined;
  getMessages: (channel: Channel | undefined) => Promise<void>;
  nowChannel: Channel | undefined;
  buttonIcon: any;
  onClick: (channel: Channel | undefined) => Promise<void>
};

const ChannelDisplay: React.FC<ChannelDisplayProps> = ({channel, getMessages, nowChannel, buttonIcon, onClick}) => {
  const onClickChannel = () => {
    getMessages(channel);
  };

  const onClickMark = () => {
    onClick(channel);
  };

  return (
    <div className="w-full flex h-auto">
        <button
          type="button"
          className={`w-4/5 ${(nowChannel === channel) ? "bg-blue-600 bg-opacity-60" : "bg-purple-900 hover:bg-purple-500" } 
          text-gray-300 text-opacity-70 font-semibold rounded-lg`}
          onClick={onClickChannel}
        >
          <div className="flex items-center">
            <p className="w-1/4 text-auto">#</p>
            <p className="w-3/4 text-auto">{channel?.channelName}</p>
          </div>
        </button>
        <button className="w-1/5 flex items-center justify-center 
        bg-purple-900 hover:bg-purple-500 text-gray-300 text-opacity-70 rounded-lg"
        onClick={onClickMark}
        >
          {buttonIcon}
        </button>
    </div>
  );
};

export default ChannelDisplay;
