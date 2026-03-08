"use client";

import { useState, useRef } from "react";

interface ChatInputProps {
    onSend: (question: string, image?: File, imagePreview?: string) => void;
    disabled: boolean;
    loading: boolean;
}

export default function ChatInput({ onSend, disabled, loading }: ChatInputProps) {
    const [question, setQuestion] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
    };

    const handleSend = () => {
        if ((!question.trim() && !selectedImage) || loading) return;
        onSend(question, selectedImage || undefined, imagePreview || undefined);
        setQuestion("");
        clearImage();
    };

    const isDisabled = disabled || loading || (!question.trim() && !selectedImage);

    return (
        <div style={{
            padding: "20px 32px 28px",
            borderTop: "1px solid #f1f5f9",
            background: "#fafbfc"
        }}>
            {imagePreview && (
                <div style={{
                    marginBottom: "12px", display: "flex",
                    alignItems: "center", gap: "12px"
                }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <img src={imagePreview} alt="preview" style={{
                            height: "56px", width: "56px", objectFit: "cover",
                            borderRadius: "12px", border: "2px solid #e2e8f0"
                        }} />
                        <button onClick={clearImage} style={{
                            position: "absolute", top: "-6px", right: "-6px",
                            width: "20px", height: "20px", borderRadius: "50%",
                            background: "#ef4444", border: "2px solid white",
                            color: "#fff", fontSize: "10px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>✕</button>
                    </div>
                    <p style={{
                        color: "#94a3b8", fontSize: "13px",
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        Image attached — add a question or send to analyze
                    </p>
                </div>
            )}

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{ display: "none" }}
                />
                <button
                    onClick={() => imageInputRef.current?.click()}
                    disabled={loading}
                    title="Attach medical image"
                    style={{
                        width: "48px", height: "48px", borderRadius: "14px",
                        background: selectedImage ? "#eff6ff" : "#f8fafc",
                        border: `1.5px solid ${selectedImage ? "#bfdbfe" : "#e2e8f0"}`,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.2s"
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={selectedImage ? "#3b82f6" : "#94a3b8"} strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                </button>

                <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    disabled={disabled || loading}
                    placeholder={
                        selectedImage ? "Ask about this image..."
                            : disabled ? "Upload a document to begin..."
                                : "Ask a medical question..."
                    }
                    style={{
                        flex: 1, background: "#ffffff",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: "14px", padding: "14px 18px",
                        color: "#0f172a", fontSize: "14px", outline: "none",
                        minWidth: 0, opacity: disabled ? 0.5 : 1,
                        fontFamily: "'Outfit', sans-serif",
                        transition: "border-color 0.2s",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={isDisabled}
                    style={{
                        width: "48px", height: "48px", borderRadius: "14px",
                        background: isDisabled ? "#f1f5f9" : "linear-gradient(135deg, #3b82f6, #2563eb)",
                        border: "none",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "all 0.2s",
                        boxShadow: isDisabled ? "none" : "0 4px 14px rgba(59,130,246,0.35)"
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke={isDisabled ? "#cbd5e1" : "#fff"} strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22,2 15,22 11,13 2,9"/>
                    </svg>
                </button>
            </div>

            {!disabled && (
                <p style={{
                    color: "#cbd5e1", fontSize: "11px", textAlign: "center",
                    marginTop: "12px", fontFamily: "'Outfit', sans-serif"
                }}>
                    MedAssist is for informational purposes only. Always consult a healthcare professional.
                </p>
            )}
        </div>
    );
}