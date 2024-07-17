"use client";
import { useEffect, useRef } from "react";
import { Imessage, useMessages } from "./messages";
import { MESSAGES_LIMIT } from "../constant/messagesLimit";

export default function InitMessages({ messages }: { messages: Imessage[] }) {
  const initState = useRef(false);
  const hasMore = messages.length >= MESSAGES_LIMIT;
  useEffect(() => {
    if (!initState.current) {
      useMessages.setState({ messages, hasMore });
    }
    initState.current = true;
  }, []);

  return <></>;
}
