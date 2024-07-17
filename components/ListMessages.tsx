"use client";

import { Imessage, useMessages } from "@/lib/store/messages";
import Message from "./Message";
import { DeleteMessage, EditMessage } from "./DeleteMessage";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowDown } from "lucide-react";
import MoreMessages from "./MoreMessages";

function ListMessages() {
  const {
    messages,
    addMessage,
    optimisticIds,
    optimisticDeleteMessage,
    optimisticUpdatedeMessage,
    setOptimisticIds,
  } = useMessages((state) => state);

  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScroll, setUserScroll] = useState(false);
  const [notify, setNotify] = useState(0);

  const supabase = supabaseBrowser();
  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          console.log(payload);
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.sent_by)
              .single();
            if (error) {
              toast.error(error.message);
              console.log(error);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              addMessage(newMessage as Imessage);
              setOptimisticIds((newMessage as Imessage).id);
            }
          }
          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotify((current) => current + 1);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          optimisticDeleteMessage(payload.old.id);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          optimisticUpdatedeMessage(payload.new as Imessage);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleUserScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScroll(isScroll);
    }
    if (
      scrollContainer.scrollTop ===
      scrollContainer.scrollHeight - scrollContainer.clientHeight
    ) {
      setNotify(0);
    }
  };
  const scrollDown = () => {
    setNotify(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      <div
        className="flex-1 flex flex-col p-5 h-full overflow-y-auto"
        ref={scrollRef}
        onScroll={handleUserScroll}
      >
        <div className="flex-1 pb-5">
          <MoreMessages />
        </div>
        <div className="space-y-7">
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
        <DeleteMessage />
        <EditMessage />
      </div>
      {userScroll && (
        <div className="absolute bottom-20 w-full">
          {notify ? (
            <div
              className="w-36 bg-indigo-500 mx-auto p-1 rounded-md hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
              onClick={scrollDown}
            >
              <h1>New {notify} Messags</h1>
            </div>
          ) : (
            <div
              className="w-10 h-10 rounded-full border items-center justify-center flex mx-auto bg-blue-500 transition-all hover:scale-110 cursor-pointer"
              onClick={scrollDown}
            >
              <ArrowDown />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ListMessages;
