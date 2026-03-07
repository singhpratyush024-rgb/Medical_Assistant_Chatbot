from logger import logger

def query_chain(chain, user_input: str):
    try:
        logger.debug(f"Received user input: {user_input}")
        
        # 1. Use .invoke() and the "input" key
        result = chain.invoke({"input": user_input})
        
        # 2. Extract "answer" and "context" (Modern keys)
        response = {
            "response": result["answer"],
            "sources": [
                doc.metadata.get("source", "<unknown>") 
                for doc in result["context"]
            ]
        }
        
        logger.debug(f"Chain response: {response}")
        return response
    
    except Exception as e:
        logger.exception("Error in query_chain")
        raise