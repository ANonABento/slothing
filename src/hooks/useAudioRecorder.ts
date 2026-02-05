"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioRecording {
  blob: Blob;
  url: string;
  duration: number;
  timestamp: Date;
}

interface UseAudioRecorderOptions {
  mimeType?: string;
  onRecordingComplete?: (recording: AudioRecording) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  recording: AudioRecording | null;
  isSupported: boolean;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
}

export function useAudioRecorder(
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn {
  const { mimeType = "audio/webm", onRecordingComplete } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recording, setRecording] = useState<AudioRecording | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedDurationRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    !!window.MediaRecorder;

  // Update duration while recording
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current - pausedDurationRef.current;
        setDuration(Math.floor(elapsed / 1000));
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setError("Audio recording is not supported in this browser");
      return;
    }

    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Find a supported mime type
      let selectedMimeType = mimeType;
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        const fallbacks = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"];
        selectedMimeType = fallbacks.find((type) => MediaRecorder.isTypeSupported(type)) || "";
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType || undefined,
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        const newRecording: AudioRecording = {
          blob,
          url,
          duration,
          timestamp: new Date(),
        };
        setRecording(newRecording);
        onRecordingComplete?.(newRecording);

        // Stop all tracks
        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.onerror = () => {
        setError("Recording failed");
        setIsRecording(false);
      };

      startTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Microphone access denied. Please allow microphone access to record.");
        } else if (err.name === "NotFoundError") {
          setError("No microphone found. Please connect a microphone.");
        } else {
          setError(`Recording failed: ${err.message}`);
        }
      } else {
        setError("Recording failed");
      }
    }
  }, [isSupported, mimeType, duration, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      pausedDurationRef.current = Date.now() - startTimeRef.current - duration * 1000;
      setIsPaused(true);
    }
  }, [isRecording, isPaused, duration]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      startTimeRef.current = Date.now() - duration * 1000;
      setIsPaused(false);
    }
  }, [isRecording, isPaused, duration]);

  const clearRecording = useCallback(() => {
    if (recording?.url) {
      URL.revokeObjectURL(recording.url);
    }
    setRecording(null);
    setDuration(0);
    setError(null);
    chunksRef.current = [];
  }, [recording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recording?.url) {
        URL.revokeObjectURL(recording.url);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [recording]);

  return {
    isRecording,
    isPaused,
    duration,
    recording,
    isSupported,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  };
}

// Helper to format duration as MM:SS
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
