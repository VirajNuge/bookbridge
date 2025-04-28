"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../../../../firebase-config/firebase-config";
import {
  collection,
  query,
  where,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./chatstyle.css";
import Header from "../../../../components/header/header";
import Footer from "../../../../components/footer/footer";
import Contact from "../../../../components/contactelement/contactelement";
import ChatSpace from "../../../../components/chatspace/chatspace";

interface ContactType {
  chatId: string;
  name: string;
  profilePic: string;
  lastMessage: string;
  lastMessageTime: number;
}

const BuyerChatPage = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const chatRef = collection(db, "chats");
      const q = query(chatRef, where("buyerId", "==", user.uid));

      const unsubscribeChats = onSnapshot(q, async (querySnapshot) => {
        try {
          const contactsList = await Promise.all(
            querySnapshot.docs.map(async (chatDoc) => {
              const chat = chatDoc.data();

              if (!chat.sellerId || !chat.lastMessageTime) return null;

              const sellerRef = doc(db, "users", chat.sellerId);
              const sellerSnap = await getDoc(sellerRef);

              if (!sellerSnap.exists()) return null;
              const sellerData = sellerSnap.data();

              return {
                chatId: chat.chatId || chatDoc.id,
                name: `${sellerData.fname} ${sellerData.lname}`,
                profilePic: sellerData.profilepicture || "/default-profile.png",
                lastMessage: chat.lastMessage || "",
                lastMessageTime: chat.lastMessageTime || 0,
              };
            })
          );

          const filteredContacts = contactsList.filter(Boolean) as ContactType[];
          setContacts(filteredContacts);
          setLoading(false);
        } catch (error) {
          console.error("❌ Error loading buyer chats:", error);
          setLoading(false);
        }
      });

      return () => unsubscribeChats();
    });

    return () => unsubscribeAuth();
  }, []);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Header />
      <br />
      <div className="allchatcontainer">
        <div className="contactContainer">
          <h3>CONTACTS</h3>
          {loading ? (
            <p>Loading contacts...</p>
          ) : contacts.length > 0 ? (
            contacts.map((chat) => (
              <div
                key={chat.chatId}
                onClick={() => setSelectedChat(chat)}
                className="contactRow"
              >
                <Contact
                  name={chat.name}
                  profilePic={chat.profilePic}
                  isOnline={true}
                  lastMessage={chat.lastMessage}
                  lastMessageTime={formatTime(chat.lastMessageTime)}
                />
              </div>
            ))
          ) : (
            <p>No active chats</p>
          )}
        </div>

        <div className="chatContainer">
          {selectedChat ? (
            <ChatSpace
              chatId={selectedChat.chatId}
              name={selectedChat.name}
              profilePic={selectedChat.profilePic}
            />
          ) : (
            <p>Select a contact to start chatting</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BuyerChatPage;
