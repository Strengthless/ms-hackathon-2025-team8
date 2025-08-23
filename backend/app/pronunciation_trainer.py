import torch
import numpy as np
import time
from string import punctuation
from typing import Dict, List, Tuple

from models.whisper_asr import WhisperASRModel
from models.phoneme_converters import get_phonem_converter
from utils.word_matching import get_best_mapped_words
from utils.word_metrics import edit_distance_python
from utils.audio_processing import preprocess_audio


class PronunciationTrainer:
    def __init__(self):
        self.asr_model = WhisperASRModel()
        self.ipa_converter = get_phonem_converter("en")
        self.sampling_rate = 16000
        self.categories_thresholds = np.array([80, 60, 59])

    def process_audio_for_given_text(self, recorded_audio: torch.Tensor, target_text: str) -> Dict:
        """
        Main method to process audio and compare with target text for pronunciation scoring.
        
        Args:
            recorded_audio: Audio tensor
            target_text: Target text to compare against
            
        Returns:
            Dictionary containing pronunciation analysis results
        """
        # Get transcript from audio
        recording_transcript, recording_ipa, word_locations = self._get_audio_transcript(recorded_audio)
        
        # Match transcribed words with target words
        real_and_transcribed_words, real_and_transcribed_words_ipa, mapped_words_indices = self._match_sample_and_recorded_words(
            target_text, recording_transcript)
        
        # Calculate pronunciation accuracy
        pronunciation_accuracy, current_words_pronunciation_accuracy = self._get_pronunciation_accuracy(
            real_and_transcribed_words_ipa)
        
        # Categorize pronunciation quality
        pronunciation_categories = self._get_words_pronunciation_category(
            current_words_pronunciation_accuracy)
        
        result = {
            'recording_transcript': recording_transcript,
            'real_and_transcribed_words': real_and_transcribed_words,
            'recording_ipa': recording_ipa,
            'real_and_transcribed_words_ipa': real_and_transcribed_words_ipa,
            'pronunciation_accuracy': pronunciation_accuracy,
            'pronunciation_categories': pronunciation_categories,
            'target_text': target_text
        }
        
        return result

    def _get_audio_transcript(self, recorded_audio: torch.Tensor) -> Tuple[str, str, List]:
        """Process audio and get transcript with word locations."""
        recorded_audio = preprocess_audio(recorded_audio)
        self.asr_model.processAudio(recorded_audio)
        
        recording_transcript, word_locations = self._get_transcript_and_words_locations(
            recorded_audio.shape[1])
        recording_ipa = self.ipa_converter.convertToPhonem(recording_transcript)
        
        return recording_transcript, recording_ipa, word_locations

    def _get_transcript_and_words_locations(self, audio_length_in_samples: int) -> Tuple[str, List]:
        """Get transcript and word locations from ASR model."""
        audio_transcript = self.asr_model.getTranscript()
        word_locations_in_samples = self.asr_model.getWordLocations()
        
        # Apply fade duration to word locations
        fade_duration_in_samples = 0.05 * self.sampling_rate
        word_locations_in_samples = [
            (int(np.maximum(0, word['start_ts'] - fade_duration_in_samples)), 
             int(np.minimum(audio_length_in_samples - 1, word['end_ts'] + fade_duration_in_samples))) 
            for word in word_locations_in_samples
        ]
        
        return audio_transcript, word_locations_in_samples

    def _match_sample_and_recorded_words(self, real_text: str, recorded_transcript: str) -> Tuple[List, List, List]:
        """Match transcribed words with target words."""
        words_estimated = recorded_transcript.split()
        words_real = real_text.split()
        
        mapped_words, mapped_words_indices = get_best_mapped_words(words_estimated, words_real)
        
        real_and_transcribed_words = []
        real_and_transcribed_words_ipa = []
        
        for word_idx in range(len(words_real)):
            if word_idx >= len(mapped_words) - 1:
                mapped_words.append('-')
            
            real_and_transcribed_words.append((words_real[word_idx], mapped_words[word_idx]))
            real_and_transcribed_words_ipa.append((
                self.ipa_converter.convertToPhonem(words_real[word_idx]),
                self.ipa_converter.convertToPhonem(mapped_words[word_idx])
            ))
        
        return real_and_transcribed_words, real_and_transcribed_words_ipa, mapped_words_indices

    def _get_pronunciation_accuracy(self, real_and_transcribed_words_ipa: List) -> Tuple[float, List]:
        """Calculate pronunciation accuracy based on phoneme differences."""
        total_mismatches = 0.
        number_of_phonemes = 0.
        current_words_pronunciation_accuracy = []
        
        for pair in real_and_transcribed_words_ipa:
            real_without_punctuation = self._remove_punctuation(pair[0]).lower()
            number_of_word_mismatches = edit_distance_python(
                real_without_punctuation, self._remove_punctuation(pair[1]).lower())
            
            total_mismatches += number_of_word_mismatches
            number_of_phonemes_in_word = len(real_without_punctuation)
            number_of_phonemes += number_of_phonemes_in_word
            
            current_words_pronunciation_accuracy.append(
                float(number_of_phonemes_in_word - number_of_word_mismatches) / number_of_phonemes_in_word * 100
            )
        
        percentage_of_correct_pronunciations = (
            number_of_phonemes - total_mismatches) / number_of_phonemes * 100
        
        return np.round(percentage_of_correct_pronunciations), current_words_pronunciation_accuracy

    def _remove_punctuation(self, word: str) -> str:
        """Remove punctuation from word."""
        return ''.join([char for char in word if char not in punctuation])

    def _get_words_pronunciation_category(self, accuracies: List) -> List:
        """Categorize pronunciation accuracy into quality levels."""
        categories = []
        for accuracy in accuracies:
            categories.append(self._get_pronunciation_category_from_accuracy(accuracy))
        return categories

    def _get_pronunciation_category_from_accuracy(self, accuracy: float) -> int:
        """Convert accuracy score to category (0=excellent, 1=good, 2=needs_improvement)."""
        return np.argmin(abs(self.categories_thresholds - accuracy))
