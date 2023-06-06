const channelDisplay = ({ channelName }:{ channelName: string }) => {
    return (
        <div className="messageDisplay">
            <div className="message">
                <button type={"submit"} className="bg-blue-500">{channelName}</button>
            </div>
        </div>
    );
};

export default channelDisplay;