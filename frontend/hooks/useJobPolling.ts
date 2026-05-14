// frontend/hooks/useJobPolling.ts

import { useEffect, useRef, useState } from "react";

type JobStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "analyzing"
  | "completed"
  | "failed";

type PollingResult = {
  status: JobStatus;
  progress: number;
  message: string;
};

export default function useJobPolling() {
  const [status, setStatus] =
    useState<JobStatus>("idle");

  const [progress, setProgress] =
    useState(0);

  const [message, setMessage] =
    useState("");

  const intervalRef =
  useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  // START POLLING
  const startPolling = (
    jobId?: string
  ) => {
    /**
     * FUTURE:
     * poll FastAPI worker status
     * GET /jobs/:id
     */

    console.log("Polling Job:", jobId);

    let currentProgress = 0;

    setStatus("uploading");

    setMessage(
      "Uploading medical report..."
    );

    intervalRef.current = setInterval(() => {
      currentProgress += 10;

      setProgress(currentProgress);

      // STEP FLOW
      if (currentProgress >= 10) {
        setStatus("uploading");

        setMessage(
          "Uploading report securely..."
        );
      }

      if (currentProgress >= 30) {
        setStatus("processing");

        setMessage(
          "Extracting OCR medical data..."
        );
      }

      if (currentProgress >= 60) {
        setStatus("analyzing");

        setMessage(
          "Generating AI clinical insights..."
        );
      }

      if (currentProgress >= 100) {
        setStatus("completed");

        setMessage(
          "AI analysis completed successfully."
        );

        stopPolling();
      }
    }, 1000);
  };

  // STOP POLLING
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);

      intervalRef.current = null;
    }
  };

  // RESET
  const resetPolling = () => {
    stopPolling();

    setStatus("idle");

    setProgress(0);

    setMessage("");
  };

  // FAIL
  const failPolling = (
    errorMessage?: string
  ) => {
    stopPolling();

    setStatus("failed");

    setMessage(
      errorMessage ||
        "AI processing failed."
    );
  };

  // CLEANUP
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const result: PollingResult = {
    status,
    progress,
    message,
  };

  return {
    ...result,

    startPolling,

    stopPolling,

    resetPolling,

    failPolling,
  };
}