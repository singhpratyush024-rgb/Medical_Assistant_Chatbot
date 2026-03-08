"use client";

import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { uploadPDF } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PDFUploadProps {
    onUploadSuccess: () => void;
}

export default function PDFUpload({ onUploadSuccess }: PDFUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [fileName, setFileName] = useState("");

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        multiple: true,
        onDrop: async (acceptedFiles) => {
            try {
                setUploading(true);
                setFileName(acceptedFiles.map(f => f.name).join(", "));
                await uploadPDF(acceptedFiles);
                setUploaded(true);
                onUploadSuccess();
            } catch (error) {
                console.error("Upload failed:", error);
            } finally {
                setUploading(false);
            }
        }
    });

    return (
        <Card className="p-4 mb-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <p className="text-blue-500">⏳ Uploading {fileName}...</p>
                ) : uploaded ? (
                    <p className="text-green-500">✅ {fileName} uploaded successfully!</p>
                ) : isDragActive ? (
                    <p className="text-blue-500">Drop the PDF here...</p>
                ) : (
                    <div>
                        <p className="text-gray-500">📎 Drag & drop PDF files here</p>
                        <p className="text-gray-400 text-sm mt-1">or click to browse</p>
                    </div>
                )}
            </div>
            {uploaded && (
                <Button
                    variant="outline"
                    className="mt-2 w-full"
                    onClick={() => { setUploaded(false); setFileName(""); }}
                >
                    Upload Another PDF
                </Button>
            )}
        </Card>
    );
}