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
import "./message.css";
import Contact from "../../../../components/contactelement/contactelement";
import ChatSpace from "../../../../components/chatspace/chatspace";

interface ContactType {
  chatId: string;
  name: string;
  profilePic: string;
  lastMessage: string;
  lastMessageTime: number;
}

const SellerChatPage = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const sellerId = user.uid;
      const chatRef = collection(db, "chats");
      const q = query(chatRef, where("sellerId", "==", sellerId));

      const unsubscribeChats = onSnapshot(q, async (querySnapshot) => {
        try {
          const contactsList = await Promise.all(
            querySnapshot.docs.map(async (chatDoc) => {
              const chat = chatDoc.data();

              if (!chat.buyerId || !chat.lastMessageTime) return null;

              const buyerRef = doc(db, "users", chat.buyerId);
              const buyerSnap = await getDoc(buyerRef);
              if (!buyerSnap.exists()) return null;

              const buyerData = buyerSnap.data();

              return {
                chatId: chat.chatId || chatDoc.id,
                name: `${buyerData.fname} ${buyerData.lname}`,
                profilePic: buyerData.profilepicture || "/default-profile.png",
                lastMessage: chat.lastMessage || "",
                lastMessageTime: chat.lastMessageTime || 0,
              };
            })
          );

          const filtered = contactsList.filter(Boolean) as ContactType[];
          setContacts(filtered);
          setLoading(false);
        } catch (error) {
          console.error("Error loading seller chats:", error);
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

  const handleChatSelect = (chat: ContactType) => {
    setSelectedContact(chat);
  };

  return (
    <div className="main-container">
      <div className="allchatcontainer">
        <div className="contactContainer">
          <h3>CONTACTS</h3>
          {loading ? (
            <p>Loading contacts...</p>
          ) : contacts.length > 0 ? (
            contacts.map((chat) => (
              <div key={chat.chatId} onClick={() => handleChatSelect(chat)}>
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
          {selectedContact ? (
            <ChatSpace
              chatId={selectedContact.chatId}
              name={selectedContact.name}
              profilePic={selectedContact.profilePic}
            />
          ) : (
            <p>Select a contact to start chatting</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerChatPage;
