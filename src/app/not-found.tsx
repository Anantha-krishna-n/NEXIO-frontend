import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Looks like this page went on a field trip.</p>

        <svg className="w-64 h-64 mx-auto mb-8" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#E5E7EB" />
          {/* Face */}
          <circle cx="100" cy="100" r="50" fill="#FFA500" />
          {/* Eyes */}
          <circle cx="80" cy="90" r="5" fill="white">
            <animate attributeName="r" values="5;3;5" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="120" cy="90" r="5" fill="white">
            <animate attributeName="r" values="5;3;5" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Mouth */}
          <path d="M85 115 Q100 125 115 115" stroke="white" strokeWidth="3" fill="#9CA3AF">
            <animate
              attributeName="d"
              values="M85 115 Q100 125 115 115;M85 120 Q100 115 115 120;M85 115 Q100 125 115 115"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          {/* Thinking bubbles */}
          <circle cx="160" cy="60" r="10" fill="#9CA3AF">
            <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="180" cy="40" r="8" fill="#9CA3AF">
            <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="195" cy="25" r="5" fill="#9CA3AF">
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          <Link href="/">Back to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}

