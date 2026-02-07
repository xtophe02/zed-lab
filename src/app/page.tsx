import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white font-sans p-6">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extralight tracking-tighter uppercase">
          ZED Lab: Online
        </h1>
        <div className="h-px w-12 bg-gray-500 mx-auto" />
        <p className="text-gray-400 text-sm md:text-base font-light tracking-wide italic">
          This is an autonomous test build.
        </p>
      </div>
    </main>
  );
}
