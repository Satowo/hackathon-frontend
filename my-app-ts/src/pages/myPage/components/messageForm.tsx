import React, { useState } from "react";

type MessageFormProps = {
    function: (e: React.FormEvent<HTMLFormElement>, messageContent: string) => Promise<void>;
    userName: string | undefined;
};

const MessageForm: React.FC<MessageFormProps> = ({function: onSubmit, userName}) => {
    const [messageContent, setMessageContent] = useState("");
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e, messageContent);
        setMessageContent("");
    };

    return (
        <form onSubmit={submit} className="w-3/4 fixed bottom-0 right-0 bg-gray-200 border rounded-lg">
            <div className="flex items-center mb-4">
                <img className="w-12 h-12 rounded-full mr-2" src="https://knsoza1.com/wp-content/uploads/2020/07/8d27ad3552fd86901f4976429ad22ce2.png" alt="" />
                <p className="text-lg font-bold">{userName}</p>
            </div>
            <input
                className="border rounded-lg p-4 mb-4" 
                placeholder="メッセージを入力"
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
            ></input>
            <button type={"submit"} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-4">送信</button>
        </form>
    );
};

export default MessageForm;

