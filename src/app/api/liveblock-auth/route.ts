import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import axios from "axios";
import axiosInstance from "@/app/utils/axiosInstance";
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized: Missing or invalid token", { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/auth/users/me`, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    const response=await axiosInstance.get("/auth/users/me")
  console.log(response,"livevlock response")
    const user = response.data.user as {
      _id: string;
      name: string;
      email: string;
      isBlocked?: boolean;
    };

    if (user.isBlocked) {
      return new Response("Access restricted: User is blocked", { status: 403 });
    }

    const roomId = request.nextUrl.searchParams.get("roomId");
    if (!roomId) {
      return new Response("Missing roomId", { status: 400 });
    }

    const session = liveblocks.prepareSession(user._id, {
      userInfo: { name: user.name, email: user.email, color: "#ff0000" },
    });

    session.allow(roomId, session.FULL_ACCESS);

    const { body, status } = await session.authorize();
    return new Response(body, { status }); 
  } catch (error) {
    console.error("Error verifying token:", error);
    return new Response("Unauthorized: Invalid token", { status: 401 });
  }
}