from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('AI_API_KEY')
BASE_URL = os.getenv('AI_BASE_URL')

client = OpenAI(
    api_key= API_KEY,
    base_url= BASE_URL,
)
response = client.chat.completions.create(
    model="gpt-audio-mini",
    messages=[{"role": "user", "content": "hey! how can I help you today?"}],
    modalities=["text", "audio"],
    audio={"format": "mp3", "voice": "alloy"},
)

print(response)


import base64
from pathlib import Path

def save_audio_from_response(response, output_path="output.mp3"):
    """
    Extract and save audio data from OpenAI chat completion response.
    
    Args:
        response: The OpenAI chat completion response object
        output_path: Path where to save the MP3 file
    """
    try:
        # Extract audio data from the response
        # Based on your response structure
        audio_data_base64 = response.choices[0].message.audio.data
        
        # Decode base64 audio data
        audio_bytes = base64.b64decode(audio_data_base64)
        
        # Save to file
        with open(output_path, 'wb') as f:
            f.write(audio_bytes)
        
        print(f"Audio saved to {output_path}")
        
        # Also print the transcript if available
        transcript = response.choices[0].message.audio.transcript
        if transcript:
            print(f"Transcript: {transcript}")
            
        return output_path
        
    except AttributeError as e:
        print(f"Error accessing audio data: {e}")
        print("Check if the response contains audio data")
        return None

# Usage with response object
save_audio_from_response(response, "gpt-audio.mp3")