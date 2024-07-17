import ChatAbout from "@/components/ChatAbout";
import ChatMessages from "@/components/ChatMessages";
import Header from "@/components/Header";
import ChatInput from "@/components/chatInput";
import InitUser from "@/lib/store/initUser";
import { createClient } from "@/lib/supabase/server";
Header;
import React from "react";

export default async function page() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return (
    <>
      <div className="h-screen max-w-3xl md:py-10 mx-auto">
        <div className="border rounded-md h-full flex flex-col relative">
          <Header user={data.session?.user} />
          {data.session?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>

      <InitUser user={data.session?.user} />
    </>
  );
}
