import {HiOutlineLogout} from "react-icons/hi";
import { HiUsers } from "react-icons/hi";
import { RxReload } from "react-icons/rx";

type Channel = {
    channelId: string;
    channelName: string;
};

type ChannelHeaderProps = {
    logout: () => Promise<void>;
    channel: Channel | undefined;
    getChannelMembers: (channel: Channel | undefined) => Promise<void>;
    getMessages: (channel: Channel | undefined) => Promise<void>;
};

const ChannelHeader: React.FC<ChannelHeaderProps>= ({logout, channel, getChannelMembers, getMessages}) => {
    const onClick = () => {
        logout();
    };

    const _onClick = () => {
        getChannelMembers(channel);
    };

    const _onClick_ = () => {
        getMessages(channel);
    };

    return (
        <div className="p-2 bg-purple-900 ">
            <div className="flex items-center ">
                {(channel === undefined) ? (<p className="w-4/5"></p>) : (
                <p className="w-4/5 flex items-center text-gray-300 text-opacity-100 text-xl font-bold ">
                    {"#  "+channel?.channelName}
                </p>
                )}
                <div className="flex items-center justify-end space-x-6 ">
                    <button
                        className="bg-purple-900 hover:bg-purple-300 text-gray-300 text-opacity-100 text-3xl font-bold py-2 px-2 rounded-lg"
                        onClick={_onClick_}
                    >
                        <RxReload/>
                    </button>
                    <button
                        className="bg-purple-900 hover:bg-purple-300 text-gray-300 text-opacity-100 text-3xl font-bold py-2 px-2 rounded-lg"
                        onClick={_onClick}
                    >
                        <HiUsers/>
                    </button>
                    <button
                        className="bg-purple-900 hover:bg-purple-300 text-gray-300 text-opacity-100 text-3xl font-bold py-2 px-2 rounded-lg"
                        onClick={onClick}
                    >
                        <HiOutlineLogout/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChannelHeader;