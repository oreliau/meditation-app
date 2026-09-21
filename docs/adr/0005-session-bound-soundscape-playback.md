# Session-bound Soundscape playback

Soundscape playback is owned by the app-wide audio-feedback capability and follows the shared Session store, rather than living in the timer screen. The selected bundled asset loops for the lifetime of a Running Session, pauses and resumes with the Session, stops when the app enters the background, resumes when the app returns to the foreground, and fails silently when unavailable; this keeps route changes and audio failures from changing timer semantics while allowing the existing volume preference to control all meditation audio.
