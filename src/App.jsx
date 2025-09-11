// import { useState } from 'react'

// import './App.css'

// function App() {

//   const handleInputChat = (e) => {
//     console.log(e.target.value);
//   }
//   const handleSubmit = () => {
//     console.log(handleInputChat(e.target.value))
//   }

//   return(
//     <div className='heading'>
//       <h2>AI Chat Bot</h2>
//       <div className='box'>
//         <div className='chats'>

//         </div>
//         <div className="input">
//           <div className='input-text'>
//             <input type="text" onChange={handleInputChat} name="" id="" />
//           </div>
//           <div className="submit">
//             <button onClick={handleSubmit} >Submit</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App

import { useState, useRef, useEffect } from "react";

// Load Puter.js (works like a global library)
const puterScript = document.createElement("script");
puterScript.src = "https://js.puter.com/v2/";
document.head.appendChild(puterScript);

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const userText = input;
    setInput("");

    // Add placeholder for bot streaming
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

    // Stream response from GPT-5-nano
    const response = await window.puter.ai.chat(userText, { stream: true, model: "gpt-5-nano" });
    // for await (const part of response) {
    //   setMessages((prev) => {
    //     const updated = [...prev];
    //     updated[updated.length - 1].text += part?.text || "";
    //     return updated;
    //   });
    // }
    let buffer = "";
for await (const part of response) {
  if (part?.text) {
    buffer += part.text;
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1].text = buffer;
      return updated;
    });
  }
}

  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Dhasu Chat Bot</h2>

      <div className="bg-white p-3 rounded-lg h-96 overflow-y-auto mb-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "text-blue-600 font-semibold" : "text-gray-800"}>
            {msg.sender === "user" ? "You: " : "Bot: "}
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow p-2 border rounded-lg"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
