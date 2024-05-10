import React, { useState } from "react";
import "./Chatbot.css";
import Lottie from "lottie-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import robot from "../../public/robot.json";
function Chatbot() {
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBwc4UjMcLVWa07Qu0GF_q_cHH6YMrGAgU"
  );
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Gemini! Ask me anything!",
      sentTime: "just now",
      sender: "Gemini",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  const processMessageToChatGPT = async (newMessages) => {
    if (newMessages.length > 0) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = newMessages[newMessages.length - 1].message;
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();

      const newMessage = {
        message: text,
        sentTime: "just now",
        sender: "ChatGPT",
      };

      const updatedMessages = [...newMessages, newMessage];
      setMessages(updatedMessages);
      setIsTyping(false);
    }
  };

  return (
    <div className="App">
      {isVisible && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
            height: "800px",
            width: "700px",
          }}
        >
          <MainContainer>
            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={
                  isTyping ? (
                    <TypingIndicator content="Gemini is typing" />
                  ) : null
                }
              >
                {messages.map((message, i) => (
                  <Message
                    key={i}
                    model={{
                      message: message.message,
                      sentTime: message.sentTime,
                      senderName: message.sender,
                      direction:
                        message.sender === "user" ? "outgoing" : "incoming",
                    }}
                    className={`${
                      message.sender === "user"
                        ? "user-message"
                        : "gemini-message"
                    }`}
                  />
                ))}
              </MessageList>
              <MessageInput
                placeholder="Type message here"
                onSend={handleSend}
              />
            </ChatContainer>
          </MainContainer>
        </div>
      )}
      <div className="">
        <button onClick={() => setIsVisible(!isVisible)}>
          <Lottie animationData={robot} loop={true} />
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
