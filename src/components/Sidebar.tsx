import Link from "next/link"
import { LogOut } from "lucide-react"
import Image from "next/image"

export function SideBar() {
  return (
    <div className="w-64 bg-white p-6 min-h-screen flex flex-col">
      <h2 className="text-xl mb-8">Ananthakrishnan H</h2>
      <nav className="space-y-8"> {/* Increased space-y */}
        <Link href="#" className="block text-gray-600 hover:text-gray-900">
          My classroom
        </Link>
        <Link href="#" className="block bg-[#FF9B6A] text-white px-4 py-2">
          Profile
        </Link>
        <Link href="#" className="block text-gray-600 hover:text-gray-900">
          Notifications
        </Link>
        <Link href="#" className="block text-gray-600 hover:text-gray-900">
          {/* Wallet */}
        </Link>
        <Link href="#" className="block text-gray-600 hover:text-gray-900">
          {/* Result */}
        </Link>
      </nav>
      <div className="mt-12">
        <button className="flex items-center text-[#FF9B6A] hover:text-[#ff8951]">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </button>
      </div>
      <div className="mt-auto -ml-6 -mb-6">
        <Image
          src="/assets/profileimg.png"
          alt="Student reading"
          width={300}
          height={300}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>
    </div>
  )
}
