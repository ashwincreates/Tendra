// components/MainPage.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Orbit, Plus, Send, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LLMResponseType, useLLMQuery } from "@/hooks/useLLMQuery";
import { ConfigDialog } from "@/components/ConfigDialog";
import { ThinkingCard } from "@/components/Thinking";

export default function MainPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );

  const [step, setStep] = useState<{ content: string } | null>(null);

  const onResponse = (message: string, type: LLMResponseType) => {
    if (type === "step") {
      setStep({ content: message });
    } else if (type === "output") {
      setStep(null);
      setMessages((prev) => [...prev, { role: "agent", content: message }]);
    }
  };

  const { sendQuery, connState, setup } = useLLMQuery({
    onResponse,
    onDisconnect: () => {
      setMessages([]);
      setStep(null);
    },
  });
  const [open, setOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    defaultValues: {
      query: "",
    },
  });

  const submitQuery = (data: any) => {
    if (!data.query) {
      return;
    } else {
      sendQuery(data.query);
      setMessages((prev) => [...prev, { role: "user", content: data.query }]);
      form.reset();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, step]);

  return (
    <main className="flex-1 flex flex-col bg-background relative">
      {" "}
      {/* Adjust height based on navbar */}
      <div className="flex-1 overflow-hidden flex flex-col ">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 p-4 max-h-[100vh] pb-[100px]"
        >
          <div className="w-full mx-auto max-w-5xl">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-6`}
              >
                <div
                  className={`flex ${msg.role === "user" ? "flex-row-reverse space-x-reverse space-x-3" : "space-x-3"}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={
                        msg.role === "user"
                          ? "/user-avatar-placeholder.png"
                          : "/grok-avatar.png"
                      }
                    />
                    <AvatarFallback>
                      {msg.role === "user" ? "U" : "G"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-md px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {step && (
              <ThinkingCard
                text={step.content}
                className="justify-start mb-2"
              />
            )}
          </div>
        </ScrollArea>
      </div>
      {messages.length === 0 && (
        <div className="absolute top-1/3 p-4 left-[50%] translate-[-50%] flex flex-col items-center">
          <p className="text-5xl font-mono flex items-center gap-2">
            <Orbit className="size-10" />
            <span>Discovery</span>
          </p>
          {!connState && (
            <Button className="mt-[4rem] h-11" onClick={() => setOpen(true)}>
              <Plus /> Connect
            </Button>
          )}
        </div>
      )}
      <ConfigDialog
        open={open}
        setOpen={setOpen}
        onSubmit={(data) => setup({ ...data })}
      />
      {connState && (
        <div className="absolute rounded-[50px] w-full max-w-3xl lg:max-w-4xl border bottom-2 left-[50%] translate-[-50%] bg-background py-2 px-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitQuery)}
              className="flex space-x-2 max-w-4xl mx-auto items-center"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem className="flex-1 min-h-[44px] resize-none">
                    <FormControl>
                      <input
                        className="focus-visible:outline-none border-0 h-full w-full shadow-none"
                        placeholder="Let's discover..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" variant={"ghost"} size="icon">
                <Send className="size-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </Form>
        </div>
      )}
    </main>
  );
}
