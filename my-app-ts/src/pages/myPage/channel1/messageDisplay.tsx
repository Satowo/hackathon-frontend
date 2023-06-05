type Message = {
    message_id: string;
    user_name: string;
    channel_id: string;
    message_content: string;
    edited: boolean
  }

const messageDisplay = ({ message }:{ message: Message }) => {
    return (
        <div className="message-display">
            <div className="message">
                <p>{message.user_name}, {message.message_content}</p>
            </div>
        </div>
    );
};

export default messageDisplay;