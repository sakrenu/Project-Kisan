import os
import json
from typing import List, Optional, Dict, Any
import logging
from pathlib import Path

# LangChain imports
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders.base import BaseLoader
from langchain_google_vertexai import VertexAIEmbeddings, VertexAI
from langchain_chroma import Chroma
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.schema import Document

# Google Cloud imports
import vertexai
from vertexai.language_models import TextEmbeddingModel, TextGenerationModel
from google.oauth2 import service_account
import google.auth

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SchemaJSONLoader(BaseLoader):
    """Custom loader for your JSON schema format."""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
    
    def load(self) -> List[Document]:
        """Load documents from JSON file with your specific schema."""
        documents = []
        
        try:
            with open(self.file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
                
            # Handle both single object and array of objects
            if isinstance(data, dict):
                data = [data]
            elif not isinstance(data, list):
                raise ValueError("JSON must contain an object or array of objects")
            
            for idx, item in enumerate(data):
                # Skip items with placeholder values
                if item.get('State') == 'State' or item.get('For') == 'For':
                    continue
                    
                # Create rich document content from all fields
                content_parts = []
                
                if 'State' in item and item['State']:
                    content_parts.append(f"State: {item['State']}")
                
                if 'Description' in item and item['Description']:
                    content_parts.append(f"Scheme: {item['Description']}")
                
                if 'Details' in item and item['Details']:
                    content_parts.append(f"Purpose: {item['Details']}")
                
                if 'For' in item and item['For']:
                    content_parts.append(f"Target Beneficiaries: {item['For']}")
                
                if 'link' in item and item['link']:
                    content_parts.append(f"Official Link: {item['link']}")
                
                # Skip if no meaningful content
                if len(content_parts) <= 1:
                    continue
                
                # Combine all parts into searchable content
                page_content = "\n\n".join(content_parts)
                
                # Create metadata for filtering and reference
                metadata = {
                    'source': self.file_path,
                    'index': idx,
                    'state': item.get('State', ''),
                    'scheme_name': item.get('Description', ''),
                    'target_beneficiaries': item.get('For', ''),
                    'link': item.get('link', ''),
                    'type': 'government_scheme'
                }
                
                documents.append(Document(
                    page_content=page_content,
                    metadata=metadata
                ))
                
        except Exception as e:
            logger.error(f"Error loading JSON file: {e}")
            raise
            
        return documents

class VertexAIRAG:
    """
    A RAG system for government schemes using LangChain and Google Cloud Vertex AI.
    Optimized for your JSON schema format.
    """
    
    def __init__(
        self,
        project_id: str,
        location: str = "us-central1",
        credentials_path: Optional[str] = None,
        embedding_model: str = "text-embedding-004",
        llm_model: str = "gemini-2.5-pro",
        vector_store_path: str = "./chroma_db"
    ):
        """
        Initialize the RAG system.
        
        Args:
            project_id: Google Cloud project ID
            location: Google Cloud region
            credentials_path: Path to service account JSON file (optional)
            embedding_model: Vertex AI embedding model name
            llm_model: Vertex AI LLM model name
            vector_store_path: Path to store vector database
        """
        self.project_id = project_id
        self.location = location
        self.embedding_model = embedding_model
        self.llm_model = llm_model
        self.vector_store_path = vector_store_path
        
        # Initialize Google Cloud AI Platform
        self._setup_vertex_ai(credentials_path)
        
        # Initialize components
        self.embeddings = None
        self.llm = None
        self.vector_store = None
        self.retrieval_qa = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,  # Smaller chunks for scheme data
            chunk_overlap=100,
            length_function=len
        )
        
        self._initialize_components()
    
    def _setup_vertex_ai(self, credentials_path: Optional[str]):
        """Setup Vertex AI authentication and initialization."""
        try:
            if credentials_path:
                credentials = service_account.Credentials.from_service_account_file(
                    credentials_path
                )
                vertexai.init(
                    project=self.project_id,
                    location=self.location,
                    credentials=credentials
                )
            else:
                # Use default credentials (e.g., from gcloud auth)
                vertexai.init(
                    project=self.project_id,
                    location=self.location
                )
            logger.info("Vertex AI initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Vertex AI: {e}")
            raise
    
    def _initialize_components(self):
        """Initialize LangChain components."""
        try:
            # Try different embedding models in order of preference
            embedding_models_to_try = [
                "text-embedding-004",
                "textembedding-gecko@003", 
                "textembedding-gecko@002",
                "textembedding-gecko@001"
            ]
            
            llm_models_to_try = [
                "gemini-2.5-pro",
                "gemini-pro",
                "text-bison@002",
                "text-bison@001"
            ]
            
            # Initialize embeddings
            embeddings_initialized = False
            for model in embedding_models_to_try:
                try:
                    self.embeddings = VertexAIEmbeddings(
                        model_name=model,
                        project=self.project_id,
                        location=self.location
                    )
                    logger.info(f"Successfully initialized embeddings with model: {model}")
                    embeddings_initialized = True
                    break
                except Exception as e:
                    logger.warning(f"Failed to initialize embeddings with {model}: {e}")
                    continue
            
            if not embeddings_initialized:
                raise Exception("Failed to initialize any embedding model")
            
            # Initialize LLM
            llm_initialized = False
            for model in llm_models_to_try:
                try:
                    self.llm = VertexAI(
                        model_name=model,
                        project=self.project_id,
                        location=self.location,
                        temperature=0.1,
                        max_output_tokens=1024
                    )
                    logger.info(f"Successfully initialized LLM with model: {model}")
                    llm_initialized = True
                    break
                except Exception as e:
                    logger.warning(f"Failed to initialize LLM with {model}: {e}")
                    continue
            
            if not llm_initialized:
                raise Exception("Failed to initialize any LLM model")
            
            logger.info("Components initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize components: {e}")
            raise
    
    def load_and_index_data(self, json_file_path: str, force_reload: bool = False):
        """
        Load data from JSON file and create/update vector store.
        
        Args:
            json_file_path: Path to your schemes.json file
            force_reload: Whether to recreate the vector store from scratch
        """
        try:
            logger.info(f"Loading data from {json_file_path}")
            
            # Load documents using custom loader
            loader = SchemaJSONLoader(json_file_path)
            documents = loader.load()
            
            logger.info(f"Loaded {len(documents)} schemes")
            
            # Split documents if needed (optional for structured data)
            texts = self.text_splitter.split_documents(documents)
            logger.info(f"Created {len(texts)} text chunks")
            
            # Create or load vector store
            try:
                if force_reload or not os.path.exists(self.vector_store_path):
                    logger.info("Creating new vector store")
                    self.vector_store = Chroma.from_documents(
                        documents=texts,
                        embedding=self.embeddings,
                        persist_directory=self.vector_store_path
                    )
                else:
                    logger.info("Loading existing vector store and adding new documents")
                    self.vector_store = Chroma(
                        persist_directory=self.vector_store_path,
                        embedding_function=self.embeddings
                    )
                    # Add new documents
                    self.vector_store.add_documents(texts)
                
                # Try to persist if method exists (for backward compatibility)
                if hasattr(self.vector_store, 'persist'):
                    self.vector_store.persist()
                    logger.info("Vector store persisted")
                else:
                    logger.info("Vector store auto-persists (no manual persist needed)")
                    
            except Exception as ve:
                logger.warning(f"Error with existing vector store: {ve}")
                logger.info("Creating fresh vector store")
                # Remove existing directory and create fresh
                import shutil
                if os.path.exists(self.vector_store_path):
                    shutil.rmtree(self.vector_store_path)
                
                self.vector_store = Chroma.from_documents(
                    documents=texts,
                    embedding=self.embeddings,
                    persist_directory=self.vector_store_path
                )
            
            logger.info("Vector store created/updated successfully")
            
            # Create the retrieval QA chain
            self._create_qa_chain()
            
            logger.info("Data indexing completed successfully")
            
        except Exception as e:
            logger.error(f"Error loading and indexing data: {e}")
            raise
    
    def _create_qa_chain(self):
        """Create the retrieval QA chain with custom prompt."""
        
        # Custom prompt template for government schemes
        prompt_template = """
        You are an AI assistant helping users find information about government schemes in India.
        Use the following context to answer the question. If you don't know the answer based on the context, say so.
        
        Context: {context}
        
        Question: {question}
        
        Please provide a comprehensive answer including:
        1. The relevant scheme name and description
        2. Purpose and details of the scheme
        3. Target beneficiaries (who it's for)
        4. Which state it's available in
        5. Official link for more information (if available)
        6. Answer in simple text, do not include any HTML or markdown formatting or bold text
        Answer:
        """
        
        PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
        
        # Create retrieval QA chain
        self.retrieval_qa = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 5}  # Retrieve top 5 most relevant schemes
            ),
            chain_type_kwargs={"prompt": PROMPT},
            return_source_documents=True
        )
    
    def query(self, question: str) -> Dict[str, Any]:
        """
        Query the RAG system.
        
        Args:
            question: User's question about government schemes
            
        Returns:
            Dictionary containing answer and source documents
        """
        if not self.retrieval_qa:
            raise ValueError("System not initialized. Please load data first.")
        
        try:
            logger.info(f"Processing query: {question}")
            result = self.retrieval_qa({"query": question})
            
            # Format the response
            response = {
                "answer": result["result"],
                "source_documents": [],
                "schemes_found": []
            }
            
            # Process source documents
            for doc in result["source_documents"]:
                doc_info = {
                    "content": doc.page_content,
                    "metadata": doc.metadata
                }
                response["source_documents"].append(doc_info)
                
                # Extract scheme information
                if doc.metadata.get("scheme_name"):
                    scheme_info = {
                        "state": doc.metadata.get("state", ""),
                        "scheme_name": doc.metadata.get("scheme_name", ""),
                        "target_beneficiaries": doc.metadata.get("target_beneficiaries", ""),
                        "link": doc.metadata.get("link", "")
                    }
                    if scheme_info not in response["schemes_found"]:
                        response["schemes_found"].append(scheme_info)
            
            logger.info("Query processed successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error processing query: {e}")
            raise
    
    def search_by_state(self, state: str, k: int = 5) -> List[Dict]:
        """
        Search for schemes by state.
        
        Args:
            state: State name to search for
            k: Number of results to return
            
        Returns:
            List of matching schemes
        """
        if not self.vector_store:
            raise ValueError("Vector store not initialized. Please load data first.")
        
        try:
            # Search using metadata filter
            results = self.vector_store.similarity_search(
                query=f"schemes in {state}",
                k=k,
                filter={"state": state}
            )
            
            schemes = []
            for doc in results:
                schemes.append({
                    "content": doc.page_content,
                    "metadata": doc.metadata
                })
            
            return schemes
            
        except Exception as e:
            logger.error(f"Error searching by state: {e}")
            raise

# Usage example
def main():
    """Example usage of the RAG system."""
    
    # Configuration
    PROJECT_ID = "project1-ba76a"  # Replace with your actual project ID
    # CREDENTIALS_PATH = "path/to/your/service-account.json"  # Optional - commented out
    JSON_FILE_PATH = "schemes.json"
    
    try:
        # Initialize RAG system (using default authentication)
        rag_system = VertexAIRAG(
            project_id=PROJECT_ID,
            # credentials_path=CREDENTIALS_PATH,  # Comment out to use default auth
            location="us-central1"
        )
        
        # Load and index your JSON data (force reload for clean start)
        rag_system.load_and_index_data(JSON_FILE_PATH, force_reload=True)
        
        # Example queries
        queries = [
            "What schemes are available for farmers in Bihar?",
            "Tell me about natural farming initiatives",
            "What financial assistance schemes are available for marginal farmers?",
            "Show me schemes for sustainable agriculture",
            "What is the Mukhyamantri Kisan Sahayata Yojana?"
        ]
        
        for query in queries:
            print(f"\n{'='*50}")
            print(f"Query: {query}")
            print(f"{'='*50}")
            
            response = rag_system.query(query)
            print(f"Answer: {response['answer']}")
            
            print(f"\nFound {len(response['schemes_found'])} relevant schemes:")
            for scheme in response['schemes_found']:
                print(f"- {scheme['scheme_name']} ({scheme['state']})")
                if scheme['target_beneficiaries']:
                    print(f"  For: {scheme['target_beneficiaries']}")
                if scheme['link']:
                    print(f"  Link: {scheme['link']}")
    
    except Exception as e:
        logger.error(f"Error in main: {e}")

if __name__ == "__main__":
    main()