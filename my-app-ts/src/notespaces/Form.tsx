import React, { useState } from "react";
import './Form.css';


type Props = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>, name: string, age: number) => void;
};

const Form = (props: Props) => {
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        props.onSubmit(e, name, age);
    };

    return (
        <form style={{ display: "flex", flexDirection: "column" }} onSubmit={submit}>
            <label>Name: </label>
            <input
                className='register-form'
                type={"text"}
                value={name}
                onChange={(e) => setName(e.target.value)}
            ></input>
            <label>Age: </label>
            <input
                className='register-form'
                type={"number"}
                style={{ marginBottom: 20 }}
                value={age}
                onChange={(e) => setAge(e.target.valueAsNumber)}
            ></input>
            <button type={"submit"}>POST</button>
        </form>
    );
};

export default Form;