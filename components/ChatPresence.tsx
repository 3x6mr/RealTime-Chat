"use client";
import { useUser } from "@/lib/store/user";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useState } from "react";

function ChatPresence() {
  const users = useUser((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const supabase = supabaseBrowser();
  useEffect(() => {
    const channel = supabase.channel("room1");
    channel
      .on("presence", { event: "sync" }, () => {
        console.log("Synced presence state: ", channel.presenceState());
        const usersIDs = [];
        for (const id in channel.presenceState()) {
          //@ts-ignore
          usersIDs.push(channel.presenceState()[id][0].userId);
        }
        setOnlineUsers([...new Set(usersIDs)].length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            online_at: new Date().toISOString(),
            userId: users?.id,
          });
        }
      });
  }, [users]);

  if (!users) {
    return <div className="h-1 w-3"></div>;
  }

  return (
    <div className="flex items-center gap-1">
      <div className="animate-pulse bg-green-500 w-4 h-4 rounded-full"></div>
      <h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
    </div>
  );
}

export default ChatPresence;
