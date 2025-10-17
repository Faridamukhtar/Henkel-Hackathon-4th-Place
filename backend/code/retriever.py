from sentence_transformers import SentenceTransformer, util
import torch

# Load embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")

def load_knowledge_base(path="/Users/hana/Henkel-Hackathon/backend/data/gliss_knowledge.txt"):
    with open(path, "r", encoding="utf-8") as f:
        docs = [d.strip() for d in f.read().split("\n\n") if d.strip()]
    embeddings = embedder.encode(docs, convert_to_tensor=True)
    return docs, embeddings

def retrieve_relevant_docs(query, docs, embeddings, top_k=2):
    query_embedding = embedder.encode(query, convert_to_tensor=True)
    scores = util.pytorch_cos_sim(query_embedding, embeddings)[0]
    top_results = torch.topk(scores, k=top_k)
    return [docs[i] for i in top_results[1]]

def load_knowledge_base_chatbot(path="/Users/hana/Henkel-Hackathon/backend/data/gliss_knowledge_chatbot.txt"):
    with open(path, "r", encoding="utf-8") as f:
        docs = [d.strip() for d in f.read().split("\n\n") if d.strip()]
    embeddings = embedder.encode(docs, convert_to_tensor=True)
    return docs, embeddings

def retrieve_relevant_docs_chatbot(query, docs, embeddings, top_k=2):
    query_embedding = embedder.encode(query, convert_to_tensor=True)
    scores = util.pytorch_cos_sim(query_embedding, embeddings)[0]
    k = min(top_k, len(scores))
    top_results = torch.topk(scores, k=k)
    return [docs[i] for i in top_results.indices]
