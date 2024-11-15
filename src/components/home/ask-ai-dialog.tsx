import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import AiChat from "./ai-chat";
import { useChat } from "ai/react";

export function AskAiDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const props = useChat();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="px-2.5 py-2 text-sm md:px-4 md:py-2.5 md:text-base"
        >
          <Icons.sparkles className="mr-1.5 h-6 sm:mr-2" /> Ask AI
        </Button>
      </DialogTrigger>
      <DialogContent className="top-14 max-h-dvh max-w-3xl translate-y-0 data-[state=closed]:slide-out-to-top-[5%] data-[state=open]:slide-in-from-top-[5%]">
        <DialogHeader>
          <div className="absolute left-6 top-6">Ask AI</div>
          <AiChat {...props} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
