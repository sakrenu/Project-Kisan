from langgraph.graph import StateGraph, END
from agents.market_agent import MarketPredictionAgent, MarketAgentState

class MarketPredictionGraph:
    def __init__(self):
        self.agent = MarketPredictionAgent()
        self.graph = self._build_graph()
    
    def _build_graph(self):
        """Build the LangGraph workflow."""
        workflow = StateGraph(MarketAgentState)
        
        # Add nodes
        workflow.add_node("extract_intent", self.agent.extract_intent)
        workflow.add_node("fetch_data", self.agent.fetch_market_data)
        workflow.add_node("analyze", self.agent.analyze_data)
        workflow.add_node("generate_response", self.agent.generate_response)
        
        # Add edges
        workflow.set_entry_point("extract_intent")
        workflow.add_conditional_edges("extract_intent", self._should_fetch_data, {
            "fetch_data": "fetch_data",
            END: END
        })
        workflow.add_conditional_edges("fetch_data", self._should_analyze, {
            "analyze": "analyze", 
            END: END
        })
        workflow.add_edge("analyze", "generate_response")
        workflow.add_edge("generate_response", END)
        
        return workflow.compile()
    
    def _should_fetch_data(self, state: MarketAgentState) -> str:
        """Decide whether to fetch market data or end."""
        # Check if we have at least commodity and try to infer missing info
        if state["commodity"]:
            # Set default values for missing information
            if not state["state"] and state["market"]:
                # Try to infer state from market
                market_to_state = {
                    "Bangalore": "Karnataka",
                    "Mumbai": "Maharashtra", 
                    "Delhi": "Delhi",
                    "Chennai": "Tamil Nadu",
                    "Pune": "Maharashtra",
                    "Hyderabad": "Telangana",
                    "Kolkata": "West Bengal"
                }
                state["state"] = market_to_state.get(state["market"], "Karnataka")
            
            if not state["market"] and state["state"]:
                # Set default market for state
                state_to_market = {
                    "Karnataka": "Bangalore",
                    "Maharashtra": "Mumbai",
                    "Tamil Nadu": "Chennai", 
                    "Punjab": "Ludhiana",
                    "Gujarat": "Ahmedabad"
                }
                state["market"] = state_to_market.get(state["state"], "Bangalore")
            
            # If we still don't have state/market, use defaults
            if not state["state"]:
                state["state"] = "Karnataka"
            if not state["market"]:
                state["market"] = "Bangalore"
                
            print(f"Final extraction: {state['commodity']}, {state['state']}, {state['market']}")
            return "fetch_data"
        return END
    
    def _should_analyze(self, state: MarketAgentState) -> str:
        """Decide whether to analyze data or end."""
        if state.get("market_data") and state["market_data"]["status"] == "success":
            return "analyze"
        return END
    
    async def run(self, initial_state: MarketAgentState) -> MarketAgentState:
        """Run the graph with initial state."""
        return await self.graph.ainvoke(initial_state)
    
