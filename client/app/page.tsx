"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { useChat } from "@/hooks/useChat";
import { useMobile } from "@/hooks/useMobile";

export default function Home() {
    const [pdfUploaded, setPdfUploaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { messages, loading, sendMessage, addMessage } = useChat();
    const isMobile = useMobile();

    useEffect(() => {
        setSidebarOpen(!isMobile);
    }, [isMobile]);

    const handleUploadSuccess = (name?: string) => {
        setPdfUploaded(true);
        if (name) setFileName(name);
        if (isMobile) setSidebarOpen(false);
        addMessage({
            role: "bot",
            content: "Document indexed successfully. You may now ask questions about its contents, or attach a medical image for visual analysis."
        });
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');

                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.85); }
                    50% { opacity: 1; transform: scale(1); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                * { box-sizing: border-box; margin: 0; padding: 0; }

                ::-webkit-scrollbar { width: 4px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

                input::placeholder { color: #cbd5e1 !important; }
                input:focus { border-color: #93c5fd !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.08) !important; }
            `}</style>

            <div style={{
                display: "flex", minHeight: "100vh",
                background: "#f8fafc",
                fontFamily: "'Outfit', sans-serif"
            }}>
                <Sidebar
                    onUploadSuccess={handleUploadSuccess}
                    pdfUploaded={pdfUploaded}
                    fileName={fileName}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    isMobile={isMobile}
                />

                <main style={{
                    flex: 1, display: "flex", flexDirection: "column",
                    height: "100vh", minWidth: 0, background: "#f8fafc"
                }}>
                    {/* Header */}
                    <div style={{
                        padding: "18px 32px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: "12px",
                        background: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            {isMobile && (
                                <button onClick={() => setSidebarOpen(true)} style={{
                                    background: "#f8fafc",
                                    border: "1.5px solid #e2e8f0",
                                    borderRadius: "10px", padding: "8px 10px",
                                    color: "#64748b", fontSize: "14px",
                                    cursor: "pointer", flexShrink: 0
                                }}>☰</button>
                            )}
                            <div>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "1px" }}>
                                    <span style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: "22px", fontWeight: 700,
                                        color: "#0f172a", letterSpacing: "-0.3px"
                                    }}>Med</span>
                                    <span style={{
                                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                                        fontSize: "22px", fontWeight: 700,
                                        color: "#3b82f6", letterSpacing: "-0.3px"
                                    }}>Assist</span>
                                </div>
                                <p style={{
                                    color: "#cbd5e1", fontSize: "10px",
                                    letterSpacing: "1.5px", textTransform: "uppercase",
                                    fontFamily: "'Outfit', sans-serif"
                                }}>Medical Intelligence</p>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div style={{
                                width: "7px", height: "7px", borderRadius: "50%",
                                background: pdfUploaded ? "#22c55e" : "#e2e8f0",
                                boxShadow: pdfUploaded ? "0 0 8px rgba(34,197,94,0.5)" : "none",
                                transition: "all 0.3s"
                            }} />
                            <span style={{
                                color: "#94a3b8", fontSize: "11px",
                                letterSpacing: "1px", textTransform: "uppercase",
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                                {pdfUploaded ? "Ready" : "Standby"}
                            </span>
                        </div>
                    </div>

                    <ChatWindow messages={messages} loading={loading} />

                    <ChatInput
                        onSend={(q, img, preview) => sendMessage(q, img, preview)}
                        disabled={!pdfUploaded}
                        loading={loading}
                    />
                </main>
            </div>
        </>
    );
}