"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function Home() {
  const [checkVoice, setCheckVoice] = useState(false);
  const [saveText, setSaveText] = useState("");
  const [recognition, setRecognition] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window.webkitSpeechRecognition) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      setRecognition(recognitionInstance);
    }
  }, []);
  const voiceHandler = () => {
    if (checkVoice === false && recognition) {
      setCheckVoice(true);
      recognition.start();
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setSaveText(result);
      };
    } else {
      setCheckVoice(false);
      recognition && recognition.stop();
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <div className="flex flex-col space-y-4 items-center w-full justify-center">
        <div>
          {saveText ? (
            <p className="text-white text-2xl">{saveText}</p>
          ) : (
            <p className="text-white text-2xl"> </p>
          )}
        </div>

        {checkVoice === false ? (
          <div
            onClick={voiceHandler}
            className="bg-green-500 hover:opacity-90 transition-all ease-in-out duration-300 w-[150px] h-[150px] rounded-full flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/openVoice.svg"
              width={64}
              height={64}
              alt="open voice icon"
            />
          </div>
        ) : (
          <div
            onClick={voiceHandler}
            className="bg-red-500 hover:opacity-90 transition-all ease-in-out duration-300 w-[150px] h-[150px] rounded-full flex items-center justify-center cursor-pointer"
          >
            <Image
              src="/closeVoice.svg"
              width={64}
              height={64}
              alt="open voice icon"
            />
          </div>
        )}
      </div>
    </div>
  );
}
