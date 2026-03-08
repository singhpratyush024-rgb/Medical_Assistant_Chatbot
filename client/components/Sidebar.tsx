"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadPDF } from "@/lib/api";

interface SidebarProps {
    onUploadSuccess: (name?: string) => void;
    pdfUploaded: boolean;
    fileName: string;
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
}

export default function Sidebar({ onUploadSuccess, pdfUploaded, fileName, isOpen, onClose, isMobile }: SidebarProps) {
    const [uploading, setUploading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        multiple: true,
        onDrop: async (acceptedFiles) => {
            try {
                setUploading(true);
                await uploadPDF(acceptedFiles);
                onUploadSuccess(acceptedFiles[0]?.name);
                if (isMobile) onClose();
            } catch (error) {
                console.error("Upload failed:", error);
            } finally {
                setUploading(false);
            }
        }
    });

    return (
        <>
            {isOpen && isMobile && (
                <div onClick={onClose} style={{
                    position: "fixed", inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    zIndex: 40, backdropFilter: "blur(2px)"
                }} />
            )}

            <aside style={{
                width: "280px",
                height: "100vh",
                background: "#f6f9fc",  // Stripe's exact sidebar color
                borderRight: "1px solid #e3e8ef",
                display: "flex",
                flexDirection: "column",
                padding: "28px 20px",
                gap: "28px",
                flexShrink: 0,
                position: isMobile ? "fixed" as const : "relative" as const,
                left: isMobile ? (isOpen ? 0 : "-280px") : 0,
                top: 0,
                zIndex: 50,
                transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
                {isMobile && (
                    <button onClick={onClose} style={{
                        position: "absolute", top: "18px", right: "18px",
                        background: "none", border: "none",
                        color: "#8898aa", fontSize: "18px",
                        cursor: "pointer", lineHeight: 1
                    }}>✕</button>
                )}

                {/* Wordmark */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
                        flexShrink: 0
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                                stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    <div>
                        <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: "22px", fontWeight: 700,
                                color: "#1a1f36", letterSpacing: "-0.3px"
                            }}>Med</span>
                            <span style={{
                                fontFamily: "'Cormorant Garamond', Georgia, serif",
                                fontSize: "22px", fontWeight: 700,
                                color: "#3b82f6", letterSpacing: "-0.3px"
                            }}>Assist</span>
                        </div>
                        <p style={{
                            color: "#8898aa", fontSize: "10px",
                            letterSpacing: "1.5px", textTransform: "uppercase",
                            fontFamily: "'Outfit', sans-serif"
                        }}>Medical Intelligence</p>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "#e3e8ef" }} />

                {/* PDF Upload */}
                <div style={{ flex: 1 }}>
                    <p style={{
                        color: "#8898aa", fontSize: "10px", fontWeight: 600,
                        letterSpacing: "1.5px", textTransform: "uppercase",
                        marginBottom: "12px", fontFamily: "'Outfit', sans-serif"
                    }}>Documents</p>

                    <div {...getRootProps()} style={{
                        border: `1.5px dashed ${isDragActive ? "#3b82f6" : "#c9d4e0"}`,
                        borderRadius: "12px", padding: "24px 16px",
                        textAlign: "center", cursor: "pointer",
                        background: isDragActive ? "#eff6ff" : "#ffffff",
                        transition: "all 0.2s ease",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                    }}>
                        <input {...getInputProps()} />
                        {uploading ? (
                            <>
                                <div style={{
                                    width: "28px", height: "28px", borderRadius: "50%",
                                    border: "2px solid #e3e8ef",
                                    borderTop: "2px solid #3b82f6",
                                    animation: "spin 0.8s linear infinite",
                                    margin: "0 auto 10px"
                                }} />
                                <p style={{ color: "#3b82f6", fontSize: "13px", fontFamily: "'Outfit', sans-serif" }}>
                                    Processing...
                                </p>
                            </>
                        ) : (
                            <>
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "12px",
                                    background: "#f0f4ff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 12px"
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14,2 14,8 20,8"/>
                                        <line x1="12" y1="18" x2="12" y2="12"/>
                                        <line x1="9" y1="15" x2="15" y2="15"/>
                                    </svg>
                                </div>
                                <p style={{ color: "#4f566b", fontSize: "13px", marginBottom: "3px", fontFamily: "'Outfit', sans-serif" }}>
                                    Drop PDF here
                                </p>
                                <p style={{ color: "#aab7c4", fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
                                    or click to browse
                                </p>
                            </>
                        )}
                    </div>

                    {pdfUploaded && (
                        <div style={{
                            marginTop: "10px", background: "#f0fdf4",
                            borderRadius: "10px", padding: "10px 14px",
                            display: "flex", alignItems: "center", gap: "10px",
                            border: "1px solid #bbf7d0"
                        }}>
                            <div style={{
                                width: "6px", height: "6px", borderRadius: "50%",
                                background: "#22c55e", flexShrink: 0,
                                boxShadow: "0 0 6px rgba(34,197,94,0.5)"
                            }} />
                            <div style={{ overflow: "hidden" }}>
                                <p style={{
                                    color: "#1a1f36", fontSize: "12px", fontWeight: 500,
                                    overflow: "hidden", textOverflow: "ellipsis",
                                    whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif"
                                }}>{fileName || "Document"}</p>
                                <p style={{ color: "#8898aa", fontSize: "11px", fontFamily: "'Outfit', sans-serif" }}>
                                    Indexed & ready
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image hint */}
                <div style={{
                    background: "#ffffff", borderRadius: "10px",
                    padding: "12px 14px", border: "1px solid #e3e8ef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}>
                    <p style={{ color: "#8898aa", fontSize: "12px", lineHeight: "1.7", fontFamily: "'Outfit', sans-serif" }}>
                        Use the camera button in the chat to upload medical images for visual analysis.
                    </p>
                </div>

                {/* Status */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 14px", borderRadius: "10px",
                    background: "#ffffff", border: "1px solid #e3e8ef",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
                }}>
                    <div style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        background: pdfUploaded ? "#22c55e" : "#c9d4e0",
                        boxShadow: pdfUploaded ? "0 0 6px rgba(34,197,94,0.5)" : "none",
                        transition: "all 0.3s"
                    }} />
                    <p style={{ color: "#8898aa", fontSize: "11px", letterSpacing: "0.5px", fontFamily: "'Outfit', sans-serif" }}>
                        {pdfUploaded ? "System ready" : "Awaiting document"}
                    </p>
                </div>
            </aside>
        </>
    );
}
