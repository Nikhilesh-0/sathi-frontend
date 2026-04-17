import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import ChatWindow from "../components/Chat/ChatWindow";

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col bg-cream">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectSession={(id) => console.log("TODO: Load session", id)} />
        <main className="flex-1 overflow-hidden">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
