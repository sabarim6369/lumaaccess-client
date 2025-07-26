"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Apiurl from '.././../api';

export default function Dummy() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const [firstimage, setfirstimage] = useState<string>("");
  // 👇 Fetch device data on mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.userId;
        console.log(userId, "userId from localStorage");
        // const res = await axios.get(`${Apiurl}/api/device/devices`, {
        //   params: { userid: "6884f7062c4a18851b7961c3" },
        //   withCredentials: true,
        // });
        const res = await axios.get(`${Apiurl}/api/device/getlivevideo`, {
          withCredentials: true,
        });
        const imagesObj = res.data.images;
        console.log("✅ images object:", imagesObj);
        const firstKey = Object.keys(imagesObj)[0];
        const firstImage = imagesObj[firstKey];
        console.log("🖼 First image:", firstImage);
        setfirstimage(firstImage);

        setDevices(imagesObj);
        //  const interval = setInterval(fetchDevices, 5000); // poll every 5s
      } catch (err) {
        console.error("[Frontend] Failed to fetch devices:", err);
      }
    };

    fetchDevices();
  }, []);

  // 👇 WebSocket logic for image stream
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[Frontend] WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data, "consoling🙏🙏🙏");
        if (data.type === "screen-stream" && data.image) {
          console.log("[Frontend] Frame received");
          setImageSrc(`data:image/png;base64,${data.image}`);
        }
      } catch (err) {
        console.error("[Frontend] Failed to parse message", err);
      }
    };

    ws.onerror = (err) => {
      console.error("[Frontend] WebSocket error:", err);
    };

    ws.onclose = () => {
      console.warn("[Frontend] WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Live Stream</h1>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Live screen"
          className="border border-white rounded-lg w-[800px] max-w-full"
        />
      ) : (
        <p>No image received yet</p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Fetched Devices:</h2>
        <ul className="list-disc list-inside">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <img
              src={`data:image/png;base64,${firstimage}`}
              alt="Device"
              className="w-60 h-auto rounded border mt-4"
            />
          </div>
        </ul>
      </div>
    </div>
  );
}
