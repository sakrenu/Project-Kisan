from llm.gemini_client import generate_kannada_response
from typing import Dict, Any

class KannadaMarketAgent:
    async def process_kannada_query(self, query: str, market_context: Dict[str, Any]) -> str:
        """Process market queries in Kannada"""
        context = f"""
        Commodity: {market_context.get('commodity')}
        Location: {market_context.get('market')}, {market_context.get('state')}
        Current Prices: {market_context.get('current_price')}
        """
        return await generate_kannada_response(query, context)
    
    async def translate_to_kannada(self, english_text: str) -> str:
        """Translate English market analysis to Kannada"""
        prompt = f"Translate this market analysis to simple Kannada:\n{english_text}"
        return await generate_kannada_response(prompt)