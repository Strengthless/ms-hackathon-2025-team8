import logging
import os
import tempfile
from typing import Optional

import torch
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from app.pronunciation_trainer import PronunciationTrainer
from utils.audio_processing import load_audio_file
from utils.helpers import get_ai_feedback, _get_quality_description
from utils.ai_feedback import _generate_fallback_feedback

# Load environment variables from .env file
load_dotenv()

# -----------------------------------------------------------------------------
# Logging configuration
# -----------------------------------------------------------------------------
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
LOG_FORMAT = os.getenv(
    "LOG_FORMAT",
    "%(asctime)s %(levelname)s [%(name)s] %(message)s"
)
DATE_FORMAT = os.getenv("LOG_DATE_FORMAT", "%Y-%m-%dT%H:%M:%S%z")

logging.basicConfig(level=LOG_LEVEL, format=LOG_FORMAT, datefmt=DATE_FORMAT)
logger = logging.getLogger("pronunciation-api")

# Reduce noise from some libraries if desired
logging.getLogger("uvicorn").setLevel(LOG_LEVEL)
logging.getLogger("uvicorn.error").setLevel(LOG_LEVEL)
logging.getLogger("uvicorn.access").setLevel(LOG_LEVEL)

# -----------------------------------------------------------------------------
# FastAPI app
# -----------------------------------------------------------------------------
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
    request: Request,
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
    client_host = request.client.host if request.client else "unknown"
    try:
        # Basic request log
        logger.info(
            "Received /analyze request"
        )

        # Validate input
        if not target_text or not target_text.strip():
            logger.warning("Validation failed: empty target_text")
            raise HTTPException(status_code=400, detail="Target text cannot be empty")
        
        # Check file type
        allowed_extensions = {'.wav', '.mp3', '.ogg', '.m4a', '.flac'}
        file_extension = os.path.splitext(audio_file.filename)[1].lower()
        if file_extension not in allowed_extensions:
            logger.warning(
                "Unsupported file type"
            )
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file type. Allowed: {', '.join(sorted(allowed_extensions))}"
            )
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            content = await audio_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

        logger.debug(
            "Saved uploaded file to temp path"        )
        
        try:
            # Load and process audio
            logger.info("Loading audio file")
            audio_tensor = load_audio_file(temp_file_path)
            logger.debug(
                "Audio loaded"
            )
            
            # Process pronunciation
            logger.info("Processing pronunciation")
            result = pronunciation_trainer.process_audio_for_given_text(audio_tensor, target_text)
            logger.debug(
                "Pronunciation processed"
            )
            
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
            logger.info(
                "Computed overall quality"
            )
            
            # Generate AI feedback if include_ai_feedback is True
            ai_feedback = None
            if include_ai_feedback:
                logger.info("Attempting AI feedback generation")
                feedback_generator = get_ai_feedback()
                if feedback_generator:
                    logger.debug("AI feedback generator available")
                    ai_feedback = feedback_generator.generate_feedback(
                        pronunciation_score=float(result["pronunciation_accuracy"]),
                        target_text=result["target_text"],
                        transcribed_text=result["recording_transcript"],
                        word_comparisons=word_comparisons,
                        overall_quality=overall_quality
                    )
                    logger.info("AI feedback generated")
                else:
                    logger.warning("AI feedback generator unavailable, using fallback")
                    ai_feedback = _generate_fallback_feedback(
                        pronunciation_score=float(result["pronunciation_accuracy"]),
                        overall_quality=overall_quality
                    )
            else:
                logger.info("AI feedback skipped per request, using fallback")
                ai_feedback = _generate_fallback_feedback(
                    pronunciation_score=float(result["pronunciation_accuracy"]),
                    overall_quality=overall_quality
                )
            
            # Prepare response
            response = {
                "success": True,
                "pronunciation_score": float(result["pronunciation_accuracy"]),
                "target_text": result["target_text"],
                "transcribed_text": result["recording_transcript"],
                "word_comparisons": word_comparisons,  # Detailed comparison info
                "overall_quality": overall_quality,
                "ai_feedback": ai_feedback
            }

            logger.info(
                "Analysis completed successfully",
                extra={
                    "client_host": client_host,
                    "pronunciation_score": response["pronunciation_score"],
                    "target_len": len(response["target_text"]),
                    "transcribed_len": len(response["transcribed_text"] or ""),
                },
            )
            return response
            
        finally:
            # Clean up temporary file
            if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
                try:
                    os.unlink(temp_file_path)
                    logger.debug("Temporary file removed", extra={"client_host": client_host, "temp_file_path": temp_file_path})
                except Exception as cleanup_err:
                    logger.exception("Failed to remove temporary file", extra={"client_host": client_host, "temp_file_path": temp_file_path})
                
    except HTTPException:
        # Already meaningful; FastAPI will handle, but log at appropriate level
        logger.warning("Request failed with HTTPException", exc_info=True, extra={"client_host": client_host})
        raise
    except Exception as e:
        logger.exception("Unhandled error in /analyze", extra={"client_host": client_host})
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    # Default host and port
    host = "0.0.0.0"
    port = int(os.getenv("PORT", "8000"))
    
    logger.info(f"Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)