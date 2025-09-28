/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: "http://localhost:5071/api"; // add all your VITE_ variables here;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}