import { useChatStore } from "../store/useChatStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="w-full h-full flex items-center justify-center px-4">

      {/* ✅ FULL HEIGHT MOBILE */}
      <div className="relative w-full max-w-5xl h-[92dvh] sm:h-[700px] md:h-[600px] overflow-hidden">
        
        <BorderAnimatedContainer>
          <div className="flex w-full h-full overflow-hidden">

            {/* LEFT */}
            <div
              className={`
                w-full sm:w-80
                bg-slate-800/50 backdrop-blur-sm
                flex flex-col h-full border-r border-slate-700/40
                ${selectedUser ? "hidden sm:flex" : "flex"}
              `}
            >
              <ProfileHeader />
              <ActiveTabSwitch />

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeTab === "chats" ? <ChatsList /> : <ContactList />}
              </div>
            </div>

            {/* RIGHT */}
            <div
              className={`
                flex-1 flex flex-col
                bg-slate-900/50 backdrop-blur-sm
                h-full min-w-0
                ${selectedUser ? "flex" : "hidden sm:flex"}
              `}
            >
              {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
            </div>

          </div>
        </BorderAnimatedContainer>

      </div>
    </div>
  );
}

export default ChatPage;