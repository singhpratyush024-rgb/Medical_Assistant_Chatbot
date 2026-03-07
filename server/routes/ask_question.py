import os
from fastapi import APIRouter, Form
from modules.llm import get_llm_chain
from langchain_core.documents import Document
from langchain_core.retrievers import BaseRetriever
from pinecone import Pinecone
from google import genai
from typing import List
from logger import logger

router = APIRouter()

PINECONE_INDEX_NAME = "medical-index"

class SimpleRetriever(BaseRetriever):
    docs: List[Document]

    def _get_relevant_documents(self, query: str) -> List[Document]:
        return self.docs

@router.post("/ask/")
async def ask_question(question: str = Form(...)):
    try:
        logger.info(f"User query: {question}")

        # 1. Setup Pinecone & Embeddings
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index(PINECONE_INDEX_NAME)

        client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

        # 2. Embed query
        result = client.models.embed_content(
            model="gemini-embedding-001",
            contents=question
        )
        embedded_query = result.embeddings[0].values

        # 3. Query Pinecone
        res = index.query(vector=embedded_query, top_k=3, include_metadata=True)

        # 4. Wrap matches into LangChain Documents
        docs = [
            Document(
                page_content=match["metadata"].get("text", "No content found"),
                metadata=match["metadata"]
            ) for match in res["matches"]
        ]

        # 5. Initialize Retriever and Chain
        retriever = SimpleRetriever(docs=docs)
        rag_chain = get_llm_chain(retriever)

        # 6. Execute Chain
        answer = rag_chain.invoke(question)

        logger.info("Query successful")
        return {"answer": answer, "context": [doc.page_content for doc in docs]}

    except Exception as e:
        logger.exception(f"Error in ask_question: {str(e)}")
        return {"error": "Internal Server Error"}