import {  useRef, useState } from "react";
import { socket } from "../../socket";

function MessageInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [recieveMsg, setRecieveMsg] = useState<string[] |null>(null);

  const add = (msg: any) => {
    console.log(msg);
    const li = `<li>${msg}</li>`;
    msgRef.current?.insertAdjacentHTML("beforeend", li);
    console.log("Message sent");
  };



  const send = async () => {
    if (inputRef.current) {
      const messageContent = inputRef.current.value.trim();
      if (messageContent.length > 0) {
        const sendingMsg = socket.emit("send-message", {
          text: inputRef.current.value,
          socketID: socket.id,
        });
        if (sendingMsg) {
          add(messageContent);
        }
      }

      setMessage("");
    }
  };

  return (
    <>
      <div ref={msgRef}></div>
      <div>{
        recieveMsg?.map((msg)=>{
          return(
            <p>{msg}</p>
          )
        })}</div>
      message :{" "}
      <input
        ref={inputRef}
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={send}>send</button>
    </>
  );
}

export default MessageInput;
