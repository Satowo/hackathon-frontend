import React from "react";

type Channel = {
    channelId: string;
    channelName: string;
};

type ChannelDisplayProps = {
    channel: Channel;
    getMessages: (channelId: string) => Promise<void>;
};


const ChannelDisplay: React.FC<ChannelDisplayProps> = ({ channel, getMessages }) => {
    const onClick = () => {
        getMessages(channel.channelId);
    };

    return (
        <div className="messageDisplay">
            <div className="message">
                <button type={"submit"} className="bg-blue-500" onClick={onClick}>{channel.channelName}</button>
            </div>
        </div>
    );
};

export default ChannelDisplay;