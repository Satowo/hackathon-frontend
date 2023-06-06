type Message = {
    messageId: string;
    userName: string;
    channelId: string;
    messageContent: string;
    edited: boolean
  }

const messageDisplay = ({ message }:{ message: Message }) => {
    return (
        <div className="messageDisplay">
            <div className="message">
                <p>{message.userName}, {message.messageContent}</p>
            </div>
        </div>
    );
};

export default messageDisplay;