import { useEffect, useState } from "react";
import "./App.css";

const DisplayMessages = () => {
  const [messages, setMessages] = useState([]);

  //display last messages
  useEffect(() => {
    fetch("http://localhost:3000/messages?page=1&limit=3")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);

  const clickToShowHandler = () => {
    let numPage = 2;
    fetch(`http://localhost:3000/messages?page=${numPage}&limit=3`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setMessages(data);
      });
    numPage++;
    console.log(numPage);
  };

  //body obcject keys for POST
  const [newText, setNewText] = useState("");
  const [from, setFrom] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newText,
        from: from,
      }),
    });
    setNewText("");
    setFrom("");
  };

  const deleteMessageHandler = (index) => {
    const mesToDelete = messages[index];
    fetch(`http://localhost:3000/messages/${mesToDelete.id}`, {
      method: "DELETE",
    }).then((deleteMessageResponse) => {
      if (deleteMessageResponse.status === 200) {
        setMessages(messages.filter((m) => m.id !== mesToDelete.id));
      } else {
        alert("There is an error");
      }
    });
  };

  return (
    <div className="content">
      <form onSubmit={submitHandler}>
        Message:
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        From:
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((m, index) => (
          <li key={index}>
            <div>
              <p>{`Message: ${m.text}`}</p>
              <p>{`From: ${m.from}`}</p>
            </div>
            <button onClick={() => deleteMessageHandler(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={clickToShowHandler}>See Latest</button>
    </div>
  );
};

export default DisplayMessages;
