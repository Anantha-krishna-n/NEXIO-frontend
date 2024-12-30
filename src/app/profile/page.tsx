// import Header from "@/components/Header";
import Header from "@/components/Header";
import { SideBar } from "@/components/Sidebar";
import { ProfileForm } from "@/components/Profileform";

export default function Profile() {
    return (
      <div>
        <Header/>
        <div className="flex bg-gray-100">
          <SideBar />
          <main className="flex-1 p-8 ">
            <ProfileForm />
          </main>
        </div>
      </div>
    )
  }