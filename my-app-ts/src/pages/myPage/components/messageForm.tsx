import React, { useState, useEffect} from "react";
import {FaUser} from "react-icons/fa";
import {MdSend} from "react-icons/md";
import {TbEditOff} from "react-icons/tb";

type MessageFormProps = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>, messageContent: string) => Promise<void>;
    onSubmitEdit: (e: React.FormEvent<HTMLFormElement>, messageContent: string) => Promise<void> 
    userName: string | undefined;
    defaultMessage: string;
};

const MessageForm: React.FC<MessageFormProps> = ({onSubmit, onSubmitEdit, userName, defaultMessage}) => {
    const [messageContent, setMessageContent] = useState("");
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        if (defaultMessage !== "") {
            setMessageContent(defaultMessage);
            setEdited(true);
        }
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

    const onClick = () => {
        setEdited(false);
        setMessageContent("");
    };

    if (!edited){
        return (
            <form onSubmit={submit} className="px-4 pt-4 pb-8 bg-gray-200 border border-gray-200 rounded-lg">
                <div className="flex space-x-3 border border-gray-200">
                    <div className="items-center justify-center text-purple-800 text-4xl"><FaUser/></div>
                    <p className="pt-1 text-xl font-bold">{userName}</p>
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
            <form onSubmit={submitEdit} className="px-4 pt-4 pb-8 bg-gray-200 border border-gray-200 rounded-lg">
                <div className="flex space-x-3 border border-gray-200">
                    <div className="items-center justify-center text-purple-800 text-4xl"><FaUser/></div>
                    <div className="flex items-center space-x-2">
                        <p className="text-xl font-bold">{userName}</p>
                        <p className="text-gray-600 opacity-50">(編集フォーム)</p>
                    </div>
                </div>
                <textarea
                    className="border rounded-lg p-3" 
                    placeholder="メッセージを入力"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                ></textarea>
                <div className="flex items-center space-x-5 fixed right-5">
                    <button type="button" className="rounded-lg text-xl text-gray-700 hover:bg-gray-500 hover:bg-opacity-50" onClick={onClick}>
                        <TbEditOff/>
                    </button>
                    <button type={"submit"} className="w-20 h-10 bg-green-700 hover:bg-opacity-80 text-white font-semibold rounded-lg">
                        <div className="flex items-center justify-center space-x-2">
                            <MdSend/>
                            <p>送信</p>
                        </div>
                    </button>
                </div> 
            </form>
        );
    }
    
};

export default MessageForm;

