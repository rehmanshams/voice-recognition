"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function Home() {
  const [recorder, setRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const initRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: "audio/wav; codecs=opus",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        audioChunks = [];
      };

      setRecorder(mediaRecorder);
    } catch (error) {
      console.error("Error accessing the microphone: ", error);
    }
  };
  useEffect(() => {
    initRecorder();
  }, []);
  let recognitionVariable;
  if (typeof window !== "undefined") {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;

    recognitionVariable = new SpeechRecognition();
  }
  const [checkVoice, setCheckVoice] = useState(false);
  const [saveText, setSaveText] = useState("");
  const voiceHandler = () => {
    if (recorder && recorder.state === "inactive") {
      setCheckVoice(true);
      setAudioUrl("");
      recorder.start();
      recognitionVariable.start();

      recognitionVariable.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setSaveText(result);
      };
    } else if (recorder && recorder.state === "recording") {
      recorder.stop();
      setCheckVoice(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <div className="flex flex-col space-y-10 items-center w-fit rounded justify-center">
        {saveText ? (
          <div className="bg-zinc-900 border-zinc-800 border py-6 px-4 md:px-10 rounded mx-4">
            <p className="text-white text-xl md:text-2xl">{saveText}</p>
          </div>
        ) : (
          <p className="text-white text-xl md:text-2xl"> </p>
        )}

        {checkVoice === false ? (
          <div
            onClick={voiceHandler}
            className="bg-green-500 hover:opacity-90 transition-all ease-in-out duration-300 p-6 rounded-full flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/openVoice.svg"
              width={32}
              height={32}
              alt="open voice icon"
            />
          </div>
        ) : (
          <div
            onClick={voiceHandler}
            className="bg-red-500 hover:opacity-90 transition-all ease-in-out duration-300 p-6 rounded-full flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/closeVoice.svg"
              width={32}
              height={32}
              alt="open voice icon"
            />
          </div>
        )}
        {audioUrl && (
          <div className="bg-zinc-900 border-zinc-800 border py-6 px-4 md:px-10 rounded mx-4">
            <audio controls>
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
