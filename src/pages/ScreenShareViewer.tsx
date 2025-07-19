import React, { useState, useRef, useEffect } from 'react';

const WS_URL = 'ws://localhost:8081'; // replace with your WS URL

export default function ScreenShareViewer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [streaming, setStreaming] = useState(false);

  const chunkQueue = useRef<Uint8Array[]>([]);
  const isAppending = useRef(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      wsRef.current?.close();
      mediaSourceRef.current = null;
      sourceBufferRef.current = null;
      chunkQueue.current = [];
    };
  }, []);

  const appendNextChunk = () => {
    if (!sourceBufferRef.current || isAppending.current || chunkQueue.current.length === 0) {
      return;
    }
    isAppending.current = true;
    const chunk = chunkQueue.current.shift()!;
    try {
      sourceBufferRef.current.appendBuffer(chunk);
    } catch (error) {
      console.error('Error appending buffer:', error);
      isAppending.current = false;
    }
  };

  const startStreaming = () => {
    if (streaming) return;

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    const video = videoRef.current;
    if (!video) return;

    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      const mimeCodec = 'video/webm; codecs=vp8';
      if (MediaSource.isTypeSupported(mimeCodec)) {
        try {
          const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
          sourceBufferRef.current = sourceBuffer;

          sourceBuffer.addEventListener('updateend', () => {
            isAppending.current = false;
            appendNextChunk();
          });

          const ws = new WebSocket(WS_URL);
          ws.binaryType = 'arraybuffer';

          ws.onopen = () => {
            console.log('WebSocket connected');
            setStreaming(true);
            // Optionally send viewer identity
            // ws.send(JSON.stringify({ type: 'viewer', deviceId: 'some-device-id' }));
          };

          ws.onmessage = (event) => {
              console.log('Received message', event);

            const chunk = new Uint8Array(event.data);
            chunkQueue.current.push(chunk);
            appendNextChunk();
          };

          ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            setStreaming(false);
          };

          ws.onclose = () => {
            console.log('WebSocket closed');
            setStreaming(false);
          };

          wsRef.current = ws;
        } catch (err) {
          console.error('Failed to add SourceBuffer:', err);
        }
      } else {
        alert('Unsupported video format');
      }
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <button onClick={startStreaming} disabled={streaming} style={{ marginBottom: 12, padding: '8px 16px' }}>
        {streaming ? 'Streaming...' : 'Show Screen Share'}
      </button>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: '100%', border: '1px solid #ccc', borderRadius: 8 }}
      />
    </div>
  );
}
