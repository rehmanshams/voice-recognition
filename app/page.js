"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recorderRef = useRef(null);
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (recorderRef.current && recognitionRef.current) {
      setAudioUrl("");
      setTranscript("");
      recorderRef.current.start();
      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      console.error("Recorder or recognition not initialized.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recognitionRef.current) {
      recorderRef.current.stop();
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      console.error("Recorder or recognition not initialized.");
    }
  };

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
          const audioBlob = new Blob([e.data], {
            type: "audio/wav; codecs=opus",
          });
          setAudioUrl(URL.createObjectURL(audioBlob));
        };
        recorderRef.current = mediaRecorder;

        if (
          "SpeechRecognition" in window ||
          "webkitSpeechRecognition" in window
        ) {
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          const speechRecognition = new SpeechRecognition();
          speechRecognition.onresult = (event) =>
            setTranscript(event.results[0][0].transcript);
          recognitionRef.current = speechRecognition;
        }
      } catch (error) {
        console.error("Error accessing the microphone:", error);
      }
    }
    init();
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <div className="flex flex-col space-y-10 items-center w-fit rounded justify-center">
        {transcript && (
          <p className="bg-zinc-900 border-zinc-800 border py-6 px-4 rounded text-white text-xl">
            {transcript}
          </p>
        )}
        <button
          onClick={handleRecordingToggle}
          className={`p-6 rounded-full flex items-center justify-center cursor-pointer bg-${
            isRecording ? "red" : "green"
          }-500 hover:opacity-90 transition duration-300`}
        >
          <Image
            src={`/${isRecording ? "close" : "open"}Voice.svg`}
            width={32}
            height={32}
            alt="voice icon"
          />
        </button>
        {audioUrl && (
          <audio controls src={audioUrl}>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    </div>
  );
}
