import { useEffect, useState } from "react";

const puter = document.createElement("script");
puter.src = "https://js.puter.com/v2/";
document.head.appendChild(puter);

const Home = () => {
    const [input, setInput] = useState("");
    const [message, setMessage] = useState([]);

    useEffect(() => {

    }, [])


    const handleChat = async () => {
        if(!input.trim()) return;

        console.log("User Data : " + input );
        setMessage( (prev) => [...prev,  { recive : "User" ,text : input}])
        console.log(message)
        const userMessage = input;
        setInput("");

        setMessage( (prev) => [...prev,  { recive : "Bot" ,text : ""}])

        const response = await window.puter.ai.chat(userMessage, { stream: true, model: "gpt-5-nano" });
        let buffer = ""
        for await(const data of response) {
            if(data?.text){
                buffer += data.text
                setMessage((prev) => {
                    const updated = [...prev];
                    updated[updated.length -1].text = buffer;
                    return updated;
                })
            }
        }

    }

    return(
        <div className="home">
            <div className="heading">
                <h2>Explore GPT-5-nano Chat Bot</h2>
            </div>
            <div className="box">
                <div className="box-chats">
                    {input}
                    {message.map((msg, idx) => (
                        <div key={idx}> {msg.recive === "User"? "You: ": "Bot: "} {msg.text}</div>
                    ))}
                </div>
                <div className="box-input">
                    <input onChange={(e) => setInput(e.target.value)} value={input}  type="text" />
                    <button onClick={handleChat} type="submit">Send</button>
                </div>
            </div>
        </div>
    )
}

export default Home;