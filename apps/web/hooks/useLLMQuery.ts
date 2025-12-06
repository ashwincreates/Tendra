import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export type LLMResponseType = "error" | "step" | "agent" | "output" | "info";

export interface Message {
  id: string | null;
  content: string;
  type: "user" | "ai";
}

export type Thread = {
  id: string;
  title: string;
};

export type Request = {
  title: string;
  requirements: string;
  budget: string;
  delivery: string;
  payment: string;
  otherTerms?: string | undefined;
};

export type LLMResponse = {
  message: string;
  requestFormat?: {
    title: string;
    requirements: string;
    budget: string;
    delivery: string;
    payment: string;
    otherTerms?: string | undefined;
  };
};

export const useLLMQuery = (_thread?: Thread) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thread, setThread] = useState<Thread | null>(_thread ?? null);
  const [request, setRequest] = useState<Request | null>(null);

  const query = async (query: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: null, content: query, type: "user" },
    ]);
    setIsLoading(true);
    const response = await axios
      .post<{ data: { thread: Thread; response: LLMResponse } }>(
        `http://localhost:8080/query${thread ? `/${thread.id}` : ""}`,
        {
          query,
        },
      )
      .then((res) => res.data.data)
      .finally(() => setIsLoading(false));
    setThread(response.thread);
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: null, content: response.response.message, type: "ai" },
    ]);
    setRequest(response.response.requestFormat ?? null);
  };

  const postRequest = async (request: Request, vendors: string[]) => {
    if (!thread) {
      toast.error("No thread selected");
      return;
    }
    setIsLoading(true);
    const response = await axios
      .post<{ message: string }>(
        `http://localhost:8080/requests/${thread.id}`,
        {
          request,
          vendors,
        },
      )
      .then((res) => res.data)
      .finally(() => setIsLoading(false));
    toast.success(response.message);
  };

  return {
    query,
    thread,
    isLoading,
    messages,
    postRequest,
    request,
  };
};
