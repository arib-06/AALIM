add a // hooks/useEyeTracking.js
'use client';

import { useState, useEffect, useRef } from 'react';

export function useEyeTracking(enabled = false) {
  const [gazedElement, setGazedElement] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const webgazerRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let isMounted = true;

    const initializeWebgazer = async () => {
      try {
        // Dynamically import webgazer
        const WebGazer = (await import('webgazer')).default;
        
        if (!WebGazer) {
          console.error('WebGazer failed to load');
          return;
        }

        webgazerRef.current = WebGazer;

        // Request camera permission
        const permissionResult = await navigator.permissions.query({
          name: 'camera',
        });

        if (permissionResult.state === 'denied') {
          console.warn('Camera permission denied');
          if (isMounted) setHasPermission(false);
          return;
        }

        if (isMounted) setHasPermission(true);

        // Configure and start webgazer
        WebGazer.setRegression('ridge')
          .setTracker('TFFacemesh')
          .begin();

        // Hide the debug video element
        const videoElement = document.querySelector('.webgazer-video');
        if (videoElement) {
          videoElement.style.display = 'none';
        }

        // Set up gaze prediction
        const trackGaze = () => {
          if (!WebGazer) return;

          WebGazer.getCurrentPrediction()
            .then(prediction => {
              if (!prediction || !isMounted) return;

              const { x, y } = prediction;

              // Get element at gaze coordinates
              const element = document.elementFromPoint(x, y);

              if (element && element.textContent) {
                // Check if it's text-like content
                const rect = element.getBoundingClientRect();
                if (rect.width > 10 && rect.height > 10) {
                  setGazedElement(element);
                }
              }

              animationFrameRef.current = requestAnimationFrame(trackGaze);
            })
            .catch(() => {
              if (isMounted) {
                animationFrameRef.current = requestAnimationFrame(trackGaze);
              }
            });
        };

        if (isMounted) {
          setIsInitialized(true);
          trackGaze();
        }
      } catch (error) {
        console.error('Failed to initialize WebGazer:', error);
        if (isMounted) setIsInitialized(false);
      }
    };

    initializeWebgazer();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (webgazerRef.current) {
        try {
          webgazerRef.current.end();
        } catch (e) {
          console.warn('Error ending webgazer:', e);
        }
      }
    };
  }, [enabled]);

  const toggleEyeTracking = () => {
    if (webgazerRef.current) {
      if (enabled) {
        webgazerRef.current.end();
      } else {
        webgazerRef.current.begin();
      }
    }
  };

  return {
    gazedElement,
    isInitialized,
    hasPermission,
    toggleEyeTracking,
  };
}
