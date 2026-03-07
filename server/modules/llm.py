import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def get_llm_chain(retriever):
    
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name="llama-3.3-70b-versatile",
        temperature=0
    )

    system_prompt = (
        "You are **MedicalBot**, an AI powered helpful medical assistant. "
        "Your job is to answer medical questions in a clear, accurate and concise manner. "
        "Use the following pieces of retrieved context to answer the question:\n\n"
        "{context}\n\n"
        "**Rules for your Answer**:\n"
        "- Always answer based on the context provided.\n"
        "- Use simple explanations and avoid technical jargon if needed.\n"
        "- If the answer is not in the context, say 'Sorry, I don't have that information.'\n"
        "- Be concise and do NOT make up facts.\n"
        "- **CRITICAL**: Do NOT give medical advice or diagnosis. Always recommend consulting a healthcare professional."
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {
            "context": retriever | format_docs,
            "input": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return rag_chain