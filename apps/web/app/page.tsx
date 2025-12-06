"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  Link,
  Link2,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { motion } from "motion/react";
import { useLLMQuery } from "@/hooks/useLLMQuery";
import { PublishDialog } from "@/components/ConfigDialog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompareProposalDialog } from "@/components/CompareProposals";

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const context = useStickToBottomContext();
  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={props.className}
    >
      <div ref={context.contentRef} className={props.contentClassName}>
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

export default function MainPage() {
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [input, setInput] = useState("");
  const { query, postRequest, thread, messages, isLoading, request } =
    useLLMQuery();
  const chatStarted = !!thread || !!messages.length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    query(input);
    setInput("");
  };
  return (
    <QueryClientProvider client={new QueryClient()}>
      <div className="h-screen flex w-full overflow-hidden">
        <div className="relative hidden lg:flex">
          <motion.div
            className="absolute z-20 h-full overflow-hidden border-r bg-white"
            style={{ width: 300 }}
            animate={{ x: chatHistoryOpen ? 0 : -300 }}
            initial={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="relative h-full" style={{ width: 300 }}>
              <>{/** Chat History */}</>
            </div>
          </motion.div>
        </div>
        <div
          className={cn(
            "grid w-full grid-cols-[1fr_0fr] transition-all duration-500",
            // artifactOpen && "grid-cols-[3fr_2fr]",
          )}
        >
          <motion.div
            className={cn(
              "relative flex min-w-0 flex-1 flex-col overflow-hidden",
              !chatStarted && "grid-rows-[1fr]",
            )}
            layout
            animate={{
              marginLeft: chatHistoryOpen ? 300 : 0,
              width: chatHistoryOpen ? "calc(100% - 300px)" : "100%",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {!chatStarted && (
              <div className="absolute top-0 left-0 z-10 flex w-full items-center justify-between gap-3 p-2 pl-4">
                <div>
                  {
                    <Button
                      className="hover:bg-gray-100"
                      variant="ghost"
                      onClick={() => setChatHistoryOpen((p) => !p)}
                    >
                      {chatHistoryOpen ? (
                        <PanelRightOpen className="size-5" />
                      ) : (
                        <PanelRightClose className="size-5" />
                      )}
                    </Button>
                  }
                </div>
                <div className="absolute top-2 right-4 flex items-center">
                  <Link />
                </div>
              </div>
            )}
            {chatStarted && (
              <div className="relative z-10 flex items-center justify-between gap-3 p-2">
                <div className="relative flex items-center justify-start gap-2">
                  <div className="absolute left-0 z-10">
                    {
                      <Button
                        className="hover:bg-gray-100"
                        variant="ghost"
                        onClick={() => setChatHistoryOpen((p) => !p)}
                      >
                        {chatHistoryOpen ? (
                          <PanelRightOpen className="size-5" />
                        ) : (
                          <PanelRightClose className="size-5" />
                        )}
                      </Button>
                    }
                  </div>
                  <motion.button
                    className="flex cursor-pointer items-center gap-2"
                    // onClick={() => setThreadId(null)}
                    animate={{
                      marginLeft: 48,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <span className="text-xl font-semibold tracking-tight">
                      Tendra
                    </span>
                  </motion.button>
                  <motion.p
                    className="flex cursor-pointer items-center gap-2"
                    animate={{
                      marginLeft: 24,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <span className="text-lg font-medium tracking-tight">
                      {thread?.title}
                    </span>
                  </motion.p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Link2 />
                  </div>
                </div>

                <div className="from-background to-background/0 absolute inset-x-0 top-full h-5 bg-gradient-to-b" />
              </div>
            )}
            <StickToBottom className="relative flex-1 overflow-hidden">
              <StickyToBottomContent
                className={cn(
                  "absolute inset-0 overflow-y-scroll px-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent",
                  !chatStarted && "mt-[25vh] flex flex-col items-stretch",
                  chatStarted && "grid grid-rows-[1fr_auto]",
                )}
                contentClassName="pt-8 pb-16 max-w-3xl mx-auto flex flex-col gap-4 w-full"
                content={messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={`group ${message.type === "user" ? "justify-end" : "justify-start"} flex w-full items-start gap-2`}
                    >
                      <div
                        className={`${message.type === "user" ? "bg-muted text-right" : "bg-primary text-white"} w-fit rounded-3xl px-4 py-2 whitespace-pre-wrap`}
                      >
                        {message.content}
                      </div>
                    </div>
                  );
                })}
                footer={
                  <div className="sticky bottom-0 flex flex-col items-center gap-8 bg-white">
                    {!chatStarted && (
                      <div className="flex flex-col items-center gap-3">
                        <h1 className="text-2xl font-semibold tracking-tight">
                          Tendra
                        </h1>
                        <p>Start your request</p>
                      </div>
                    )}

                    <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />

                    <div
                      className={cn(
                        "bg-muted relative z-10 mx-auto mb-8 w-full max-w-3xl rounded-2xl shadow-xs transition-all",
                      )}
                    >
                      <form
                        onSubmit={handleSubmit}
                        className="mx-auto grid max-w-3xl grid-rows-[1fr_auto] gap-2"
                      >
                        <textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              !e.shiftKey &&
                              !e.metaKey &&
                              !e.nativeEvent.isComposing
                            ) {
                              e.preventDefault();
                              const el = e.target as HTMLElement | undefined;
                              const form = el?.closest("form");
                              form?.requestSubmit();
                            }
                          }}
                          placeholder="Type your message..."
                          className="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                        />

                        <div className="flex items-center gap-6 p-2 pt-4">
                          <Button
                            variant={"outline"}
                            className="shadow-md transition-all"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpen(true);
                            }}
                            disabled={!request}
                          >
                            Publish Request
                          </Button>
                          <Button
                            variant={"outline"}
                            className="shadow-md transition-all"
                            onClick={(e) => {
                              e.preventDefault();
                              setCompareOpen(true);
                            }}
                            disabled={!request}
                          >
                            Compare Proposals
                          </Button>
                          <Button
                            type="submit"
                            className="ml-auto shadow-md transition-all"
                            disabled={isLoading || !input.trim()}
                          >
                            Send
                          </Button>
                          <PublishDialog
                            open={open}
                            setOpen={setOpen}
                            onSubmit={({ vendors }) => {
                              if (request && vendors.length > 0) {
                                postRequest(request, vendors);
                              }
                              setOpen(false);
                            }}
                          />
                          <CompareProposalDialog
                            open={compareOpen}
                            setOpen={setCompareOpen}
                            thread={thread}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                }
              />
            </StickToBottom>
          </motion.div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
