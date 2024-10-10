'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccessPage() {
  const [accessCode, setAccessCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace '6666' with your actual access code
    if (accessCode === '6666') {
      router.push('/landing');
    } else {
      setErrorMessage('Invalid Access Code');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
        NowhereCollective | Rewerker
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="password"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Enter Access Code"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Submit
        </button>
      </form>
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
}
