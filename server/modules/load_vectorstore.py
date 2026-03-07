import os
import time
from pathlib import Path
from dotenv import load_dotenv
from tqdm.auto import tqdm
from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
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
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=texts
    )
    return [e.values for e in result.embeddings]


def load_vectorstore(uploaded_files):

    file_paths = []

    # 1. Save uploaded files
    for file in uploaded_files:
        save_path = Path(UPLOAD_DIR) / file.filename
        with open(save_path, "wb") as f:
            f.write(file.file.read())
        file_paths.append(str(save_path))

    # 2. Split
    for file_path in file_paths:
        loader = PyPDFLoader(file_path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
        chunks = splitter.split_documents(documents)

        texts = [chunk.page_content for chunk in chunks]
        metadata = [chunk.metadata for chunk in chunks]

        for i, m in enumerate(metadata):
            m["text"] = texts[i]

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