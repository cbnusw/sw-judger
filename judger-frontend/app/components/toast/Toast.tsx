'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ToastInfoStore } from '@/store/ToastInfo';

// Toast 타입 정의
export interface Toast {
  id: string;
  type: string;
  message: string;
}

export default function Toast() {
  const toasts = ToastInfoStore((state) => state.toasts);
  const removeToast = ToastInfoStore((state) => state.removeToast);

  return (
    <div
      className="fixed top-0 left-0 w-screen z-[100] pointer-events-none"
      style={{ height: 'auto', display: 'flex', justifyContent: 'center' }}
    >
      <div className="relative">
        <div className="toast-container">
          {toasts.map((toast, index) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              index={index}
              removeToast={removeToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  index: number;
  removeToast: (id: string) => void;
}

function ToastItem({ toast, index, removeToast }: ToastItemProps) {
  const [topPosition, setTopPosition] = useState(0);
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (toastRef.current) {
        const height = toastRef.current.offsetHeight;
        const gap = 20; // 토스트 사이의 간격
        setTopPosition(index * (height + gap));
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => window.removeEventListener('resize', updatePosition);
  }, [index]);

  return (
    <div
      ref={toastRef}
      className="toast"
      style={{
        position: 'absolute',
        top: `${topPosition}px`,
        transition: 'top 0.3s ease',
      }}
    >
      <span>
        {toast.type === 'success' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
          >
            <path
              fill="#15c07e"
              d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
            />
          </svg>
        ) : toast.type === 'warning' ? (
          <div className="relative flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="15"
              viewBox="0 -960 960 960"
              width="15"
              fill="#333d4b"
              className="absolute -z-10"
            >
              <path d="M480-71.87q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Zm0-91q133.04 0 225.09-92.04 92.04-92.05 92.04-225.09 0-133.04-92.04-225.09-92.05-92.04-225.09-92.04-133.04 0-225.09 92.04-92.04 92.05-92.04 225.09 0 133.04 92.04 225.09 92.05 92.04 225.09 92.04Zm0 0q-133.04 0-225.09-92.04-92.04-92.05-92.04-225.09 0-133.04 92.04-225.09 92.05-92.04 225.09-92.04 133.04 0 225.09 92.04 92.04 92.05 92.04 225.09 0 133.04-92.04 225.09-92.05 92.04-225.09 92.04Z" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="22"
              viewBox="0 -960 960 960"
              width="22"
              fill="#ffcf58"
            >
              <path d="M479.95-271.87q19.92 0 33.45-13.48 13.53-13.48 13.53-33.4 0-19.92-13.47-33.58-13.48-13.65-33.41-13.65-19.92 0-33.45 13.65-13.53 13.66-13.53 33.58 0 19.92 13.47 33.4 13.48 13.48 33.41 13.48Zm.05-167.65q19.15 0 32.33-13.18 13.17-13.17 13.17-32.32v-154.5q0-19.15-13.17-32.33-13.18-13.17-32.33-13.17t-32.33 13.17q-13.17 13.18-13.17 32.33v154.5q0 19.15 13.17 32.32 13.18 13.18 32.33 13.18Zm0 367.65q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Z" />
            </svg>
          </div>
        ) : toast.type === 'error' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="22"
            viewBox="0 -960 960 960"
            width="22"
            fill="#db5257"
          >
            <path d="M479.95-271.87q19.92 0 33.45-13.48 13.53-13.48 13.53-33.4 0-19.92-13.47-33.58-13.48-13.65-33.41-13.65-19.92 0-33.45 13.65-13.53 13.66-13.53 33.58 0 19.92 13.47 33.4 13.48 13.48 33.41 13.48Zm.05-167.65q19.15 0 32.33-13.18 13.17-13.17 13.17-32.32v-154.5q0-19.15-13.17-32.33-13.18-13.17-32.33-13.17t-32.33 13.17q-13.17 13.18-13.17 32.33v154.5q0 19.15 13.17 32.32 13.18 13.18 32.33 13.18Zm0 367.65q-84.91 0-159.34-32.12-74.44-32.12-129.5-87.17-55.05-55.06-87.17-129.5Q71.87-395.09 71.87-480t32.12-159.34q32.12-74.44 87.17-129.5 55.06-55.05 129.5-87.17 74.43-32.12 159.34-32.12t159.34 32.12q74.44 32.12 129.5 87.17 55.05 55.06 87.17 129.5 32.12 74.43 32.12 159.34t-32.12 159.34q-32.12 74.44-87.17 129.5-55.06 55.05-129.5 87.17Q564.91-71.87 480-71.87Z" />
          </svg>
        ) : null}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}
