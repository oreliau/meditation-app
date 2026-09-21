import wave
import shutil
import subprocess
from pathlib import Path
import numpy as np

import tempfile
import wave
from pathlib import Path

path = "../assets/prettyjohn1-calming-zen-537655.wav"
audio_path = Path(path)
ASSETS_DIR = Path(__file__).resolve().parent.parent / "assets"
AUDIO_EXTENSIONS = {".mp3", ".wav"}


def dominant_frequency(audio_path: Path) -> float:
    with wave.open(str(audio_path), "rb") as wav_file:
        sample_rate = wav_file.getframerate()
        channel_count = wav_file.getnchannels()
        frames = wav_file.readframes(wav_file.getnframes())

    audio = np.frombuffer(frames, dtype=np.int16).astype(np.float32)
    if channel_count > 1:
        audio = audio.reshape(-1, channel_count).mean(axis=1)

    peak = np.max(np.abs(audio))
    if peak == 0:
        return 0.0
    audio /= peak

    magnitudes = np.abs(np.fft.rfft(audio))
    frequencies = np.fft.rfftfreq(len(audio), d=1 / sample_rate)
    return float(frequencies[1:][np.argmax(magnitudes[1:])])


def frequency_for_file(audio_path: Path) -> float:
    if audio_path.suffix.lower() != ".mp3":
        return dominant_frequency(audio_path)

    if shutil.which("ffmpeg") is None:
        raise RuntimeError("ffmpeg is required to convert MP3 files. Install it with: brew install ffmpeg")

    with tempfile.TemporaryDirectory() as temporary_directory:
        wav_path = Path(temporary_directory) / f"{audio_path.stem}.wav"
        subprocess.run(
            ["ffmpeg", "-loglevel", "error", "-y", "-i", str(audio_path), str(wav_path)],
            check=True,
        )
        return dominant_frequency(wav_path)


audio_files = sorted(
    path for path in ASSETS_DIR.iterdir() if path.is_file() and path.suffix.lower() in AUDIO_EXTENSIONS
)

if not audio_files:
    print(f"No audio files found in {ASSETS_DIR}")
else:
    for audio_file in audio_files:
        try:
            frequency = frequency_for_file(audio_file)
            print(f"{audio_file.name}: {frequency:.2f} Hz")
        except (OSError, RuntimeError, subprocess.CalledProcessError, ValueError) as error:
            print(f"{audio_file.name}: could not analyze ({error})")