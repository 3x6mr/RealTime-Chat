"use client";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessages } from "@/lib/store/messages";

function ChatInput() {
  const user = useUser((state) => state.user);
  const supabase = supabaseBrowser();
  const addMessage = useMessages((state) => state.addMessage);
  const optimisticIds = useMessages((state) => state.optimisticIds);
  const setOptimisticIds = useMessages((state) => state.setOptimisticIds);
  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidv4(),
        text,
        created_at: new Date().toISOString(),
        sent_by: user?.id,
        is_edited: false,
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
        },
      };

      const { error } = await supabase.from("messages").insert({
        text,
      });

      if (error) {
        toast.error(error.message);
        console.log(error);
      }
      // addMessage(newMessage as Imessage);
      // setOptimisticIds(newMessage.id);
    } else {
      toast.error("Message cannot be empty");
    }
  };

  return (
    <div className="p-5">
      <Input
        placeholder="Type a message"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}

export default ChatInput;
