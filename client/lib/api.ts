import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Upload PDFs
export const uploadPDF = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    const res = await axios.post(`${BASE_URL}/upload_pdfs/`, formData);
    return res.data;
};

// Ask question
export const askQuestion = async (question: string) => {
    const formData = new FormData();
    formData.append("question", question);
    const res = await axios.post(`${BASE_URL}/ask/`, formData);
    return res.data;
};

export const askWithImage = async (question: string, image: File) => {
    const formData = new FormData();
    formData.append("question", question);
    formData.append("image", image);
    const res = await axios.post(`${BASE_URL}/ask_with_image/`, formData);
    return res.data;
};