"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/hooks/useChat";

interface ChatWindowProps {
    messages: Message[];
    loading: boolean;
}

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    return (
        <div style={{
            flex: 1, overflowY: "auto", padding: "36px 32px",
            display: "flex", flexDirection: "column", gap: "24px"
        }}>
            {messages.length === 0 ? (
                <div style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: "24px", padding: "60px 20px"
                }}>
                    <div style={{
                        width: "72px", height: "72px", borderRadius: "22px",
                        background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(59,130,246,0.25)"
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div style={{ textAlign: "center", maxWidth: "380px" }}>
                        <p style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: "28px", fontWeight: 700,
                            color: "#0f172a", margin: "0 0 12px",
                            letterSpacing: "-0.5px"
                        }}>
                            How can I help you today?
                        </p>
                        <p style={{
                            color: "#94a3b8", fontSize: "14px", lineHeight: "1.8",
                            fontFamily: "'Outfit', sans-serif"
                        }}>
                            Upload a medical document from the sidebar to begin your consultation, or attach an image for visual analysis.
                        </p>
                    </div>

                    {/* Feature pills */}
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
                        {["PDF Analysis", "Image Recognition", "RAG Search", "Groq AI"].map(f => (
                            <span key={f} style={{
                                padding: "6px 14px", borderRadius: "100px",
                                background: "#f1f5f9", color: "#64748b",
                                fontSize: "12px", fontFamily: "'Outfit', sans-serif",
                                border: "1px solid #e2e8f0", fontWeight: 500
                            }}>{f}</span>
                        ))}
                    </div>
                </div>
            ) : (
                messages.map((msg, i) => (
                    <div key={i} style={{
                        display: "flex",
                        justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        alignItems: "flex-end", gap: "10px",
                        animation: "fadeIn 0.3s ease"
                    }}>
                        {msg.role === "bot" && (
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "10px",
                                background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, boxShadow: "0 2px 8px rgba(59,130,246,0.3)"
                            }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                            </div>
                        )}
                        <div style={{
                            maxWidth: "70%",
                            borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                            overflow: "hidden",
                            boxShadow: msg.role === "user"
                                ? "0 4px 16px rgba(59,130,246,0.2)"
                                : "0 2px 12px rgba(0,0,0,0.06)"
                        }}>
                            {msg.image && (
                                <img src={msg.image} alt="uploaded" style={{
                                    width: "100%", maxHeight: "220px",
                                    objectFit: "cover", display: "block"
                                }} />
                            )}
                            <div style={{
                                padding: "14px 18px",
                                background: msg.role === "user"
                                    ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                                    : "#ffffff",
                                border: msg.role === "bot" ? "1px solid #e2e8f0" : "none",
                                color: msg.role === "user" ? "#ffffff" : "#1e293b",
                                fontSize: "14px", lineHeight: "1.75",
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                {msg.role === "bot" && (
                                    <p style={{
                                        fontSize: "10px", color: "#3b82f6",
                                        letterSpacing: "1.5px", textTransform: "uppercase",
                                        marginBottom: "6px", fontWeight: 600
                                    }}>MedAssist</p>
                                )}
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))
            )}

            {loading && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                    <div style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, boxShadow: "0 2px 8px rgba(59,130,246,0.3)"
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div style={{
                        background: "#ffffff", border: "1px solid #e2e8f0",
                        borderRadius: "20px 20px 20px 4px", padding: "16px 20px",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
                    }}>
                        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
                            {[0, 1, 2].map(i => (
                                <div key={i} style={{
                                    width: "6px", height: "6px", borderRadius: "50%",
                                    background: "#3b82f6",
                                    animation: "pulse 1.4s infinite",
                                    animationDelay: `${i * 0.2}s`
                                }} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}