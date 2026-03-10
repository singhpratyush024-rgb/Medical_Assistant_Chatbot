import os
import time
import pdfplumber
from pathlib import Path
from dotenv import load_dotenv
from tqdm.auto import tqdm
from pinecone import Pinecone, ServerlessSpec
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from google import genai

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_ENV = "us-east-1"
PINECONE_INDEX_NAME = "medical-index"

UPLOAD_DIR = "./uploaded_docs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1. Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)
spec = ServerlessSpec(cloud="aws", region=PINECONE_ENV)

existing_indexes = [i['name'] for i in pc.list_indexes()]

if PINECONE_INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=PINECONE_INDEX_NAME,
        dimension=3072,
        metric="cosine",
        spec=spec
    )
    while not pc.describe_index(PINECONE_INDEX_NAME).status.ready:
        print("Waiting for Pinecone index to be ready...")
        time.sleep(2)

index = pc.Index(PINECONE_INDEX_NAME)

# 2. Initialize Google GenAI client
client = genai.Client(api_key=GOOGLE_API_KEY)

def get_embeddings(texts):
    all_embeddings = []
    batch_size = 90  # stay under 100 limit

    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=batch
        )
        all_embeddings.extend([e.values for e in result.embeddings])

        # Wait 20 seconds between batches to avoid rate limit
        if i + batch_size < len(texts):
            print(f"Rate limit pause... waiting 20 seconds before next batch")
            time.sleep(20)

    return all_embeddings

def extract_text_from_pdf(path: str):
    """Extracts text and tables from PDF using pdfplumber"""
    text_chunks = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            # Extract normal text
            text = page.extract_text()
            if text and text.strip():
                text_chunks.append(text)

            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                if table:
                    table_text = "\n".join([
                        " | ".join([str(cell).strip() if cell else "" for cell in row])
                        for row in table
                    ])
                    text_chunks.append(f"TABLE:\n{table_text}")

    return text_chunks


def load_vectorstore(uploaded_files):

    file_paths = []

    # 1. Save uploaded files
    for file in uploaded_files:
        save_path = Path(UPLOAD_DIR) / file.filename
        with open(save_path, "wb") as f:
            f.write(file.file.read())
        file_paths.append(str(save_path))

    # 2. Process each file
    for file_path in file_paths:
        print(f"Extracting text from {file_path}...")

        # Extract text + tables
        raw_chunks = extract_text_from_pdf(file_path)
        full_text = "\n\n".join(raw_chunks)

        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        chunks = splitter.create_documents([full_text])

        texts = [chunk.page_content for chunk in chunks]
        metadata = [{"source": file_path, "text": chunk.page_content} for chunk in chunks]
        ids = [f"{Path(file_path).stem}_{i}" for i in range(len(chunks))]

        # 3. Embed
        print(f"Embedding chunks from {file_path}...")
        embeddings = get_embeddings(texts)

        # 4. Upsert to Pinecone
        print(f"Upserting chunks from {file_path} to Pinecone...")
        with tqdm(total=len(embeddings), desc="Upserting chunks") as progress:
            index.upsert(vectors=list(zip(ids, embeddings, metadata)))
            progress.update(len(embeddings))

        print(f"Finished processing {file_path}.")