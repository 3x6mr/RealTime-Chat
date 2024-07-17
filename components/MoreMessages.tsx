import { Button } from "./ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { MESSAGES_LIMIT } from "@/lib/constant/messagesLimit";
import { useMessages } from "@/lib/store/messages";
import { get_From_To } from "@/lib/utils";
import { toast } from "sonner";

function MoreMessages() {
  const page = useMessages((state) => state.page);
  const setMessages = useMessages((state) => state.setMessages);
  const hasMore = useMessages((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = get_From_To(page, MESSAGES_LIMIT);

    const supabase = supabaseBrowser();

    const { data, error } = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  };
  if (hasMore) {
    return (
      <Button variant={"outline"} className="w-full" onClick={fetchMore}>
        Load More
      </Button>
    );
  } else {
    <></>;
  }
}

export default MoreMessages;
