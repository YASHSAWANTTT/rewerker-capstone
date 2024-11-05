import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black">
        <img src="/image.png" width="500" height="500" alt="logo" />
      <Link
        href="/access"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Enter Access Code
      </Link>
    </div>
  );
}
