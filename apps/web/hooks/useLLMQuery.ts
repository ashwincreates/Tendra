import { State } from "@/types/LLMState";
import { Source, SourceConfig } from "@/types/Source";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const socketUrl = "ws://localhost:8000/api/ws";

export type LLMResponseType = "error" | "step" | "agent" | "output" | "info";

export type LLMResponse = {
  type: LLMResponseType;
  message: string;
};

export const useLLMQuery = ({
  onResponse,
  onDisconnect,
}: {
  onResponse: (message: string, type: LLMResponseType) => void;
  onDisconnect: () => void;
}) => {
  const websocket = useRef<WebSocket | null>(null);
  const [connState, setConnState] = useState<State | null>(null);

  const ws = () => {
    if (websocket.current) return websocket.current;
    throw Error("Websocket not intialized");
  };

  const onConnect = () => {};

  const setup = ({
    source,
    config,
  }: {
    source: Source;
    config: SourceConfig;
  }) => {
    ws().send(
      JSON.stringify({
        type: "setup",
        source: source,
        config: config,
      }),
    );
  };

  const sendQuery = (query: string) => {
    ws().send(
      JSON.stringify({
        type: "query",
        query: query,
      }),
    );
  };

  const handleAgent = (message: string) => {
    toast.info(message);
    setConnState("CONNECTED");
  };

  const handleError = (message: string) => {
    toast.info(message);
    setConnState(null);
  };

  const handleInfo = (info: string) => toast.info(info);

  const handleResponse = (message: string, type: LLMResponseType) =>
    onResponse(message, type);

  const onMessage = (data: MessageEvent) => {
    const response = JSON.parse(data.data) as LLMResponse;
    if (response.type === "agent") handleAgent(response.message);
    if (response.type === "info") handleInfo(response.message);
    if (response.type === "step") handleResponse(response.message, "step");
    if (response.type === "output") handleResponse(response.message, "output");
    if (response.type === "error") handleError(response.message);
  };

  const onError = (ev: Event) => {
    toast.error("Error connecting to the server");
  };

  const onClose = () => {
    toast.warning("Connection closed");
    setConnState(null);
    onDisconnect();
  };

  useEffect(() => {
    if (!websocket.current) {
      websocket.current = new WebSocket(socketUrl);
      websocket.current.addEventListener("open", onConnect);
      websocket.current.addEventListener("message", onMessage);
      websocket.current.addEventListener("close", onClose);
      websocket.current.addEventListener("error", onError);
    }

    return () => {
      if (websocket.current) {
        websocket.current.removeEventListener("open", onConnect);
        websocket.current.removeEventListener("message", onMessage);
        websocket.current.removeEventListener("error", onError);
        websocket.current.close();
      }
    };
  }, []);

  return {
    sendQuery,
    setup,
    connState,
  };
};
