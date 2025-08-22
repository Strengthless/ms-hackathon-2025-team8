from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import torch
import tempfile
import os
from typing import Optional
from dotenv import load_dotenv
from app.pronunciation_trainer import PronunciationTrainer
from utils.audio_processing import load_audio_file
from utils.helpers import get_ai_feedback, _get_quality_description
from utils.ai_feedback import _generate_fallback_feedback

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Pronunciation Checker API",
    description="API for checking pronunciation accuracy of spoken audio against target text (English only) with AI-powered feedback for Hong Kong students",
    version="1.0.0"
)

# Add CORS middleware to handle cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize pronunciation trainer and AI feedback generator
pronunciation_trainer = PronunciationTrainer()
ai_feedback_generator = None


@app.post("/analyze")
async def analyze(
    audio_file: UploadFile = File(..., description="Audio file to analyze"),
    target_text: str = Form(..., description="Target text to compare against"),
    include_ai_feedback: bool = Form(True, description="Whether to include AI-generated feedback")
):
    """
    Check pronunciation accuracy of uploaded audio against target text by converting to IPA phonemes and comparing.
    
    Args:
        audio_file: Audio file (supports common formats like wav, mp3, ogg)
        target_text: Target text to compare pronunciation against
        include_ai_feedback: Whether to include AI-generated feedback (default: True)
    
    Returns:
        JSON response with pronunciation analysis results and AI feedback
    """
    try:
        # Validate input
        if not target_text.strip():
            raise HTTPException(status_code=400, detail="Target text cannot be empty")
        
        # Check file type
        allowed_extensions = {'.wav', '.mp3', '.ogg', '.m4a', '.flac'}
        file_extension = os.path.splitext(audio_file.filename)[1].lower()
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            # Write uploaded file to temporary file
            content = await audio_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Load and process audio
            audio_tensor = load_audio_file(temp_file_path)
            
            # Process pronunciation
            result = pronunciation_trainer.process_audio_for_given_text(audio_tensor, target_text)
            
            # Prepare word comparisons for response
            word_comparisons = [
                {
                    "target_word": pair[0],
                    "transcribed_word": pair[1],
                    "target_phonemes": ipa_pair[0],
                    "transcribed_phonemes": ipa_pair[1]
                }
                for pair, ipa_pair in zip(
                    result["real_and_transcribed_words"], 
                    result["real_and_transcribed_words_ipa"]
                )
            ]
            
            # Get overall quality description
            overall_quality = _get_quality_description(result["pronunciation_accuracy"])
            
            # Generate AI feedback if include_ai_feedback is set to True from frontend
            ai_feedback = None
            if include_ai_feedback:
                print("Getting AI feedback...")
                feedback_generator = get_ai_feedback()
                if feedback_generator:
                    print("AI feedback generator is available, generating feedback...")
                    ai_feedback = feedback_generator.generate_feedback(
                        pronunciation_score=float(result["pronunciation_accuracy"]),
                        target_text=result["target_text"],
                        transcribed_text=result["recording_transcript"],
                        word_comparisons=word_comparisons,
                        overall_quality=overall_quality
                    )
            else:
                print("Skipping AI feedback as per request.")
                ai_feedback = _generate_fallback_feedback(
                    pronunciation_score=float(result["pronunciation_accuracy"]),
                    overall_quality=overall_quality
                )
                
                
            print(f"AI Feedback: {ai_feedback}")
            
            # Prepare response
            response = {
                "success": True,
                "pronunciation_score": float(result["pronunciation_accuracy"]),
                "target_text": result["target_text"],
                "transcribed_text": result["recording_transcript"],
                "word_comparisons": word_comparisons, # This outputs and compares the phonemes of target & transcribed (Just extra info, not really important)
                "overall_quality": overall_quality,
                "ai_feedback": ai_feedback
            }
            
            return response
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    # Default host and port
    host = "0.0.0.0"
    port = 8000
    
    print(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
