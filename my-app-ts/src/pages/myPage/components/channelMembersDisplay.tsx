import { useState } from "react";

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

type ChannelMembersDisplayProps = {
    member: User;
};

const ChannelMembersDisplay: React.FC<ChannelMembersDisplayProps> = ({member}) => {
  return (
    <div className="w-full py-1">
        <div className="w-full hover:bg-gray-300 rounded-md">
            <p className="items-center font-semibold">{member?.userName}</p>
        </div>
    </div>
  );
};

export default ChannelMembersDisplay;
