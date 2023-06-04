import React from "react";
import "./usersDisplay.css";

type User = {
    id: string;
    name: string;
    age: number;
}

const usersDisplay = ({ user }:{ user: User }) => {
    return (
        <div className="user-box">
            <div className="user">
                <p>{user.name}, {user.age}</p>
            </div>
        </div>
    );
};

export default usersDisplay;
