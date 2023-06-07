import React, { useState, useEffect} from "react";
import {FaUser} from "react-icons/fa";
import {MdSend} from "react-icons/md";

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
            <form onSubmit={submit} className="w-3/4 h-1/4 fixed bottom-0 right-0 px-4 pt-4 pb-8 bg-gray-200 border border-gray-200 rounded-lg">
                <div className="flex space-x-3 border border-gray-200">
                    <div className="items-center justify-center text-purple-800 text-4xl"><FaUser/></div>
                    <p className="text-xl font-bold">{userName}</p>
                </div>
                <textarea
                    className="border rounded-lg p-3" 
                    placeholder="メッセージを入力"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                ></textarea>
                <button type={"submit"} className="w-20 h-10 fixed right-5 bg-green-700 hover:bg-opacity-80 text-white font-semibold rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                        <MdSend/>
                        <p>送信</p>
                    </div>
                </button>
            </form>
        );
    }

    else {
        return (
            <form onSubmit={submitEdit} className="w-3/4 h-1/4 fixed bottom-0 right-0 px-4 pt-4 pb-8 bg-gray-200 border border-gray-200 rounded-lg">
                <div className="flex space-x-3 border border-gray-200">
                    <div className="items-center justify-center text-purple-800 text-4xl"><FaUser/></div>
                    <p className="text-xl font-bold">{userName}</p>
                </div>
                <textarea
                    className="border rounded-lg p-3" 
                    placeholder="メッセージを入力"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                ></textarea>
                <button type={"submit"} className="w-20 h-10 fixed right-5 bg-green-700 hover:bg-opacity-80 text-white font-semibold rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                        <MdSend/>
                        <p>送信</p>
                    </div>
                </button>
            </form>
        );
    }
    
};

export default MessageForm;

