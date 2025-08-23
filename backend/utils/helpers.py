from utils.ai_feedback import get_ai_feedback_generator

ai_feedback_generator = None

# Some helper functions for quality and AI feedback
def get_ai_feedback():
    """Get AI feedback generator instance (lazy initialization)."""
    global ai_feedback_generator
    if ai_feedback_generator is None:
        try:
            ai_feedback_generator = get_ai_feedback_generator()
            print("AI feedback generator is ready to use!")
        except ValueError as e:
            print(f"Warning: {e}. AI feedback will use fallback templates.")
            ai_feedback_generator = None
    return ai_feedback_generator

def _get_quality_description(score: float) -> str:
    """Convert numerical score to quality description."""
    if score >= 80:
        return "Excellent"
    elif score >= 60:
        return "Good"
    else:
        return "Needs Improvement"
