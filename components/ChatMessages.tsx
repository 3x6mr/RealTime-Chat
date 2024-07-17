import ListMessages from "./ListMessages";

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import InitMessages from "@/lib/store/initMessages";
import { MESSAGES_LIMIT } from "@/lib/constant/messagesLimit";

async function ChatMessages() {
  const supabase = createClient();
  const { data } = await supabase
    .from("messages")
    .select("*,users(*)")
    .range(0, MESSAGES_LIMIT)
    .order("created_at", { ascending: false });

  return (
    <Suspense fallback={"loding"}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  );
}

export default ChatMessages;
