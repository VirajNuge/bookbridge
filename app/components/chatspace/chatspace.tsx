"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase-config/firebase-config";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import {
  cloudinaryUploadUrl,
  uploadPreset,
} from "../../cloudinary-config/cloudinary-config";
import "./chatspace.css";

interface ChatProps {
  chatId: string;
  name: string;
  profilePic: string;
}

interface Message {
  senderId: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
  type?: "text" | "image";
  replyTo?: {
    text?: string;
    imageUrl?: string;
    senderId: string;
  };
}

const ChatSpace: React.FC<ChatProps> = ({ chatId, name, profilePic }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (!chatId || !auth.currentUser) return;

    const chatRef = doc(db, "chats", chatId);

    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setMessages(data.messages || []);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !auth.currentUser) return;

    const user = auth.currentUser;
    const timestamp = Date.now();

    const message: Message = {
      senderId: user.uid,
      text: newMessage.trim(),
      timestamp,
      type: "text",
      ...(replyToMessage && {
        replyTo: {
          ...(replyToMessage.text && { text: replyToMessage.text }),
          ...(replyToMessage.imageUrl && { imageUrl: replyToMessage.imageUrl }),
          senderId: replyToMessage.senderId,
        },
      }),
    };

    const chatRef = doc(db, "chats", chatId);

    try {
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          chatId,
          buyerId: user.uid,
          sellerId: "",
          messages: [message],
          lastMessage: message.text,
          lastMessageTime: timestamp,
        });
      } else {
        const existingMessages = chatSnap.data().messages || [];
        await updateDoc(chatRef, {
          messages: [...existingMessages, message],
          lastMessage: message.text,
          lastMessageTime: timestamp,
        });
      }

      setNewMessage("");
      setReplyToMessage(null);
    } catch (err) {
      console.error("\u274C Failed to send text message:", err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(cloudinaryUploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        sendImageMessage(data.secure_url);
      } else {
        console.warn("\u26A0\uFE0F Cloudinary returned no secure_url.");
      }
    } catch (err) {
      console.error("\u274C Image upload failed:", err);
    }
  };

  const sendImageMessage = async (imageUrl: string) => {
    const user = auth.currentUser;
    if (!user || !imageUrl) return;

    const timestamp = Date.now();

    const message: Message = {
      senderId: user.uid,
      imageUrl,
      timestamp,
      type: "image",
      ...(replyToMessage && {
        replyTo: {
          ...(replyToMessage.text && { text: replyToMessage.text }),
          ...(replyToMessage.imageUrl && { imageUrl: replyToMessage.imageUrl }),
          senderId: replyToMessage.senderId,
        },
      }),
    };

    const chatRef = doc(db, "chats", chatId);

    try {
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          chatId,
          buyerId: user.uid,
          sellerId: "",
          messages: [message],
          lastMessage: "[Image]",
          lastMessageTime: timestamp,
        });
      } else {
        const existingMessages = chatSnap.data().messages || [];
        await updateDoc(chatRef, {
          messages: [...existingMessages, message],
          lastMessage: "[Image]",
          lastMessageTime: timestamp,
        });
      }

      setReplyToMessage(null);
    } catch (err) {
      console.error("\u274C sendImageMessage failed:", err);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={profilePic} alt={name} className="chat-profile-pic" />
        <h3>{name}</h3>
      </div>

      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isText = !msg.type || msg.type === "text";
            const isImage = msg.type === "image";

            return (
              <div
                key={index}
                className={`message ${
                  msg.senderId === auth.currentUser?.uid ? "sent" : "received"
                }`}
                onClick={() => setReplyToMessage(msg)}
              >
                {msg.replyTo && (
                  <div className="reply-preview-inside">
                    <strong>Replying to:</strong>{" "}
                    {msg.replyTo.text
                      ? msg.replyTo.text
                      : msg.replyTo.imageUrl
                      ? "[Image]"
                      : ""}
                  </div>
                )}
                {isText && <p>{msg.text}</p>}
                {isImage && msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Sent" className="chat-image" />
                )}
              </div>
            );
          })
        ) : (
          <p className="no-messages">No messages yet.</p>
        )}
      </div>

      <div className="chat-input">
        {replyToMessage && (
          <div className="reply-preview-box">
            <p>
              Replying to:{" "}
              {replyToMessage.text
                ? replyToMessage.text
                : replyToMessage.imageUrl
                ? "[Image]"
                : ""}
            </p>
            <button onClick={() => setReplyToMessage(null)}>\u2716</button>
          </div>
        )}
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
        <label htmlFor="imageUpload" className="upload-button">
          <img src="/upload.png" />
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>
    </div>
  );
};

export default ChatSpace;