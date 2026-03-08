import { useState } from "react";
import { askQuestion, askWithImage } from "@/lib/api";

export interface Message {
    role: "user" | "bot";
    content: string;
    image?: string;
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (question: string, image?: File, imagePreview?: string) => {
        const q = question || "Analyze this medical image";
        setMessages(prev => [...prev, {
            role: "user",
            content: q,
            image: imagePreview
        }]);
        setLoading(true);
        try {
            let res: { answer: string };
            if (image) {
                res = await askWithImage(q, image);
            } else {
                res = await askQuestion(q);
            }
            setMessages(prev => [...prev, { role: "bot", content: res.answer }]);
        } catch {
            setMessages(prev => [...prev, {
                role: "bot",
                content: "Something went wrong. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    const addMessage = (msg: Message) => setMessages(prev => [...prev, msg]);

    return { messages, loading, sendMessage, addMessage };
}