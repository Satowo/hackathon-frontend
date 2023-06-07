import React, { useState, useEffect} from "react";

type MessageFormProps = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>, messageContent: string) => Promise<void>;
    onSubmitEdit: (e: React.FormEvent<HTMLFormElement>, messageContent: string) => Promise<void> 
    userName: string | undefined;
    defaultMessage: string;
};

const MessageForm: React.FC<MessageFormProps> = ({onSubmit, onSubmitEdit, userName, defaultMessage}) => {
    const [messageContent, setMessageContent] = useState("");

    useEffect(() => {
        setMessageContent(defaultMessage);
    }, [defaultMessage]);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e, messageContent);
        setMessageContent("");
    };

    const submitEdit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmitEdit(e, messageContent);
        setMessageContent("");
    };

    if (defaultMessage==""){
        return (
            <form onSubmit={submit} className="w-3/4 h-1/3 fixed bottom-0 right-0 p-4 bg-gray-200 border rounded-lg">
                <div className="flex items-center mt-2 ml-3">
                    <img className="w-12 h-11 rounded-full mr-2" src="https://knsoza1.com/wp-content/uploads/2020/07/8d27ad3552fd86901f4976429ad22ce2.png" alt="" />
                    <p className="text-lg font-bold">{userName}</p>
                </div>
                <input
                    className="border rounded-lg p-4 mb-2" 
                    placeholder="メッセージを入力"
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                ></input>
                <button type={"submit"} className="bg-green-700 hover:bg-opacity-80 text-white font-semibold py-2 px-4 rounded-lg mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail-forward" width="36" height="30" viewBox="0 0 24 22" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 18h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7.5" />
                        <path d="M3 6l9 6l9 -6" />
                        <path d="M15 18h6" />
                        <path d="M18 15l3 3l-3 3" />
                    </svg>
                </button>
            </form>
        );
    }

    else {
        return (
            <form onSubmit={submitEdit} className="w-3/4 h-1/3 fixed bottom-0 right-0 bg-gray-200 border rounded-lg">
                <div className="flex items-center mt-2 ml-3">
                    <img className="w-12 h-11 rounded-full mr-2" src="https://knsoza1.com/wp-content/uploads/2020/07/8d27ad3552fd86901f4976429ad22ce2.png" alt="" />
                    <p className="text-lg font-bold">{userName}</p>
                </div>
                <input
                    className="border rounded-lg p-4 mb-2" 
                    placeholder="メッセージを入力"
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                ></input>
                <button type={"submit"} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-5">送信</button>
            </form>
        );
    }
    
};

export default MessageForm;

