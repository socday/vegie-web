import { useEffect, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Simple in-memory cache to avoid reloading the same GLTF multiple times
const gltfCache = new Map();

function loadGLTF(url) {
  if (gltfCache.has(url)) return gltfCache.get(url);

  const promise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => resolve(gltf),
      undefined,
      (err) => reject(err)
    );
  });

  // store the promise so subsequent callers reuse it
  gltfCache.set(url, promise);
  return promise;
}

// Hook: returns a GLTF object or null while loading. Caches results.
export default function useLazyGLTF(url, enabled = true) {
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    if (!url || !enabled) return;
    let mounted = true;

    loadGLTF(url)
      .then((g) => {
        if (!mounted) return;
        setGltf(g);
      })
      .catch((err) => {
        // keep behavior similar to useLoader: log the error
        // but don't throw so the app doesn't crash silently
        // Caller can handle null gltf as needed
        // eslint-disable-next-line no-console
        console.error('useLazyGLTF failed to load', url, err);
      });

    return () => {
      mounted = false;
    };
  }, [url, enabled]);

  return gltf;
}
