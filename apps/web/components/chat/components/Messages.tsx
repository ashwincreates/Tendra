import { Message as TMessage } from "@/types/Chat";

export function Message({ message }: { message: TMessage }) {
  return (
    <div>
      {message.sender === "user" ? (
        <div className="bg-blue-500 text-white p-2 rounded-md">
          {message.content}
        </div>
      ) : (
        <div className="bg-gray-200 p-2 rounded-md">{message.content}</div>
      )}
    </div>
  );
}
