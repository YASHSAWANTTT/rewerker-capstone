import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black">
       <img 
          src="app\public\NowhereCollective_Logo_Hori_Black_web.png" 
          className="w-48 h-32 rounded-full object-cover"
          />
      
      <h1 className="text-4xl font-bold mb-4">
       NowhereCollective
      </h1>
      <Link
        href="/access"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg"
      >
        Enter Access Code
      </Link>
    </div>
  );
}
