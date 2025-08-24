import requests
import json
import os
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def _generate_fallback_feedback(pronunciation_score: float, overall_quality: str) -> str:
    """Generate fallback feedback if AI service is unavailable."""
    
    if pronunciation_score >= 80:
        chinese = "🎉 太棒了!"
        english = "🎉 Excellent work!"
    elif pronunciation_score >= 60:
        chinese = "👍 做得不錯!"
        english = "👍 Good job!"
    else:
        chinese = "💪 不要灰心!"
        english = "💪 Don't give up!"
    
    return f"{chinese}\n\n{english}"

class AIFeedbackGenerator:
    def __init__(self):
        """
        Initialize AI feedback generator using Poe.
        
        Args:
            api_key: Poe API key. If not provided, will try to get from environment.
        """
        self.api_key = os.getenv("POE_API_KEY")
        print("Loaded Poe API Key from environment.")
        if not self.api_key:
            raise ValueError("POE key is required. Set POE_API_KEY in .env file")
        
        self.base_url = "https://api.poe.com/v1"
        self.model = "GPT-4o"
        
    def generate_feedback(self, 
                         pronunciation_score: float,
                         target_text: str,
                         transcribed_text: str,
                         word_comparisons: List[Dict],
                         overall_quality: str,
                         is_letter_correct_all_words: str) -> str:
        """
        Generate encouraging feedback for kids based on pronunciation results.
        
        Args:
            pronunciation_score: Pronunciation accuracy score (0-100)
            target_text: Target text that was supposed to be pronounced
            transcribed_text: What was actually transcribed from the audio by Whisper
            word_comparisons: List of word-by-word comparisons
            overall_quality: Overall quality description (Excellent/Good/Needs Improvement)
            
        Returns:
            Encouraging feedback message in Chinese and English
        """
        
        # Prepare the prompt for the AI
        prompt = self._create_prompt(
            pronunciation_score, target_text, transcribed_text, 
            word_comparisons, overall_quality, is_letter_correct_all_words
        )
        print(f"AI Feedback Prompt: {prompt}")
        try:
            # Make request to Poe
            response = self._make_Poe_request(prompt)
            print(f"LLM Response: {response}")
            return response
            
        except Exception as e:
            # Fallback to template-based feedback if AI fails
            print(f"Error generating AI feedback: {e}")
            return self._generate_fallback_feedback(pronunciation_score, overall_quality)
    
    def _create_prompt(self, 
                      pronunciation_score: float,
                      target_text: str,
                      transcribed_text: str,
                      word_comparisons: List[Dict],
                      overall_quality: str,
                      is_letter_correct_all_words: str) -> str:
        """Create a prompt for the AI to generate feedback."""
       
        # Analyze word-level issues
        problematic_words = []
        good_words = []
        
        for comparison in word_comparisons:
            target_word = comparison['target_word']
            transcribed_word = comparison['transcribed_word']
            target_phonemes = comparison['target_phonemes']
            transcribed_phonemes = comparison['transcribed_phonemes']

            if transcribed_word == '-' or transcribed_word.lower() != target_word.lower():
                problematic_words.append({
                    'target': target_word,
                    'spoken': transcribed_word,
                    'target_phonemes': target_phonemes,
                    'transcribed_phonemes': transcribed_phonemes
                })
            else:
                good_words.append({
                    'word': target_word,
                    'phonemes': target_phonemes
                })
        phoneme_analysis = ""
        if problematic_words:
            phoneme_analysis += "\nWords with pronunciation issues:\n"
            for word in problematic_words:
                phoneme_analysis += f"- '{word['target']}' (expected: {word['target_phonemes']}, spoken: {word['transcribed_phonemes']})\n"
        
        if good_words:
            phoneme_analysis += "\nWords pronounced correctly:\n"
            for word in good_words:
                phoneme_analysis += f"- '{word['word']}' ({word['phonemes']})\n"

        
        prompt = f"""
You are a friendly English pronunciation tutor for Hong Kong primary school students (ages 6-12). 
Generate a very short feedback message in both Chinese (繁體中文) and English based on the student's pronunciation attempt.
Keep the language simple, as the students might not be very proficient in English.

Student's Performance:
- Target text: "{target_text}"
- What they said: "{transcribed_text}"
- Pronunciation score: {pronunciation_score}%
- Overall quality: {overall_quality}

Phoneme Analysis:{phoneme_analysis}
Letter by Letter correctness (1 is correct, 0 is wrong): {is_letter_correct_all_words}


Guidelines:
1. Use simple, friendly language suitable for primary school students
2. Provide specific, actionable feedback
3. Include both Chinese and English in your response
4. Use emojis to make it more engaging for kids
5. If score is high (80%+), focus minor improvements
6. If score is medium (60-79%), provide direct tips
7. If score is low (<60%), give simple, clear advice
8. Reference pronunciation differences when giving feedback (e.g., "try saying 'team' like 'tim' ")
9. Never include phonetic symbols in the feedback
10. Limit the length of your feedback to a maximum of 6 words for each language
Format your response as:
[Your feedback in Chinese]

[Your feedback in English]
"""

        return prompt
   
    def _make_Poe_request(self, prompt: str) -> str:
        """Make a request to Poe API."""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "max_tokens": 300,
            "temperature": 0.7
        }
        try:
            response = requests.post(
                url=f"{self.base_url}/chat/completions",
                headers=headers,
                data=json.dumps(data),
                timeout=8
            )
        except requests.RequestException as e:
            print(f"Error connecting to Poe API: {e}")
            raise Exception(f"Failed to connect to Poe API: {e}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Poe Response: {json.dumps(result, indent=2)}")
            return result['choices'][0]['message']['content'].strip()
        else:
            raise Exception(f"Poe API error: {response.status_code} - {response.text}")
   
    def _generate_fallback_feedback(self, pronunciation_score: float, overall_quality: str) -> str:
        """Generate fallback feedback if AI service is unavailable."""
        
        return _generate_fallback_feedback(pronunciation_score, overall_quality)


def get_ai_feedback_generator() -> AIFeedbackGenerator:
    """Get an instance of AI feedback generator."""
    return AIFeedbackGenerator()
