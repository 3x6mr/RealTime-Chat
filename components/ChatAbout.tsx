import React from "react";

export default function ChatAbout() {
  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="text-center space-y-5">
        <h1 className="text-3xl font-bold">Welcome to Daily Chat</h1>

        <p className="w-96">
          This is chat application that power by supabase realitme db. Login to
          send messages
        </p>
      </div>
    </div>
  );
}
