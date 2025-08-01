import pickle
from pathlib import Path
from typing import List, Dict, Any, Tuple
from sentence_transformers import SentenceTransformer, util

EMBEDDINGS_CACHE = Path(__file__).parent / "embeddings_cache.pkl"
MODEL_NAME = "all-MiniLM-L6-v2"

def _get_prompt_text(prompt: Dict[str, Any]) -> str:
    # Combine title, description, and tags for embedding
    tags = ", ".join(prompt.get("tags", []))
    return f"{prompt.get('title', '')} {prompt.get('description', '')} {tags}"

class SemanticSearch:
    def __init__(self, prompts: List[Dict[str, Any]]):
        self.prompts = prompts
        self.model = SentenceTransformer(MODEL_NAME)
        self.embeddings = None
        self._load_or_create_embeddings()

    def _load_or_create_embeddings(self):
        # Try to load cached embeddings
        if EMBEDDINGS_CACHE.exists():
            with open(EMBEDDINGS_CACHE, "rb") as f:
                cache = pickle.load(f)
                if cache.get("prompt_filenames") == [p["filename"] for p in self.prompts]:
                    self.embeddings = cache["embeddings"]
                    return

        # Compute embeddings if cache is missing or outdated
        texts = [_get_prompt_text(p) for p in self.prompts]
        self.embeddings = self.model.encode(texts, convert_to_tensor=True)
        with open(EMBEDDINGS_CACHE, "wb") as f:
            pickle.dump({
                "prompt_filenames": [p["filename"] for p in self.prompts],
                "embeddings": self.embeddings
            }, f)

    def search(self, query: str, limit: int = 3) -> List[Tuple[Dict[str, Any], float]]:
        if self.embeddings is None:
            return []
        # Embed the query
        query_emb = self.model.encode(query, convert_to_tensor=True)
        # Compute cosine similarities
        scores = util.pytorch_cos_sim(query_emb, self.embeddings)[0]
        # Get top N results
        top_indices = scores.topk(limit).indices.tolist()
        results = [(self.prompts[i], float(scores[i])) for i in top_indices]
        return results
