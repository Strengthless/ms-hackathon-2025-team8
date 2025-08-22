**BTW, I am using Python 3.11.9**
**macOS:**
```bash
brew install ffmpeg
```

1. **Create a virtual environment:**
```bash
python -m venv venv
source venv/bin/activate 
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env file with your configuration
```

## Start the FastAPI Server

### Development Mode
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Documentation


### API Endpoints

#### POST `/analyze`

**Request:**
- **Content-Type**: `multipart/form-data`
- **Method**: POST

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `audio_file` | File | Yes | Audio file to analyze (WAV, MP3, OGG, M4A, FLAC) |
| `target_text` | String | Yes | Target text to compare pronunciation against |
| `include_ai_feedback` | Boolean | No | Whether to include AI-generated feedback (default: true) |

**Example Request (cURL):**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "audio_file=@your_audio.wav" \
  -F "target_text=Hello world" \
  -F "include_ai_feedback=true"
```

**Response Format:**
```json
{
  "success": true,
  "pronunciation_score": 0.85,
  "target_text": "Hello world",
  "transcribed_text": "Hello world",
  "word_comparisons": [
    {
      "target_word": "Hello",
      "transcribed_word": "Hello",
      "target_phonemes": "həˈloʊ",
      "transcribed_phonemes": "həˈloʊ"
    },
    {
      "target_word": "world",
      "transcribed_word": "world",
      "transcribed_phonemes": "wɜrld",
      "target_phonemes": "wɜrld"
    }
  ],
  "overall_quality": "Good",
  "ai_feedback": "Excellent pronunciation! Your 'Hello world' was very clear..."
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | Boolean | Whether the analysis was successful |
| `pronunciation_score` | Float | Pronunciation accuracy score (0.0 - 1.0) |
| `target_text` | String | The original target text |
| `transcribed_text` | String | What was transcribed from the audio |
| `word_comparisons` | Array | Detailed comparison of each word's phonemes |
| `overall_quality` | String | Quality assessment ("Poor", "Fair", "Good", "Excellent") |
| `ai_feedback` | String | AI-generated feedback and suggestions |

