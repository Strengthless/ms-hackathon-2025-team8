import torch
import numpy as np
import audioread
import tempfile
import os
from torchaudio.transforms import Resample


def preprocess_audio(audio: torch.Tensor) -> torch.Tensor:
    """Normalize and preprocess audio for ASR processing."""
    audio = audio - torch.mean(audio)
    audio = audio / torch.max(torch.abs(audio))
    return audio


def load_audio_file(file_path: str, target_sample_rate: int = 16000) -> torch.Tensor:
    """Load audio file and resample to target sample rate."""
    transform = Resample(orig_freq=48000, new_freq=target_sample_rate)
    
    signal, fs = audioread_load(file_path)
    signal = transform(torch.Tensor(signal)).unsqueeze(0)
    
    return signal


def audioread_load(path, offset=0.0, duration=None, dtype=np.float32):
    """Load an audio buffer using audioread."""
    y = []
    with audioread.audio_open(path) as input_file:
        sr_native = input_file.samplerate
        n_channels = input_file.channels

        s_start = int(np.round(sr_native * offset)) * n_channels

        if duration is None:
            s_end = np.inf
        else:
            s_end = s_start + (int(np.round(sr_native * duration)) * n_channels)

        n = 0

        for frame in input_file:
            frame = buf_to_float(frame, dtype=dtype)
            n_prev = n
            n = n + len(frame)

            if n < s_start:
                continue

            if s_end < n_prev:
                break

            if s_end < n:
                frame = frame[: s_end - n_prev]

            if n_prev <= s_start <= n:
                frame = frame[(s_start - n_prev):]

            y.append(frame)

    if y:
        y = np.concatenate(y)
        if n_channels > 1:
            y = y.reshape((-1, n_channels)).T
    else:
        y = np.empty(0, dtype=dtype)

    return y, sr_native


def buf_to_float(x, n_bytes=2, dtype=np.float32):
    """Convert an integer buffer to floating point values."""
    scale = 1.0 / float(1 << ((8 * n_bytes) - 1))
    fmt = "<i{:d}".format(n_bytes)
    return scale * np.frombuffer(x, fmt).astype(dtype)
