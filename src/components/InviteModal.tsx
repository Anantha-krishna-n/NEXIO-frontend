import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axiosInstance from "@/app/utils/axiosInstance"
import { Toaster, toast } from 'sonner';


interface InviteModalProps {
  inviteCode: string
  classroomId: string 
  isOpen: boolean
  onClose: () => void
}

const InviteModal: React.FC<InviteModalProps> = ({ inviteCode,classroomId, isOpen, onClose }) => {
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting invitation with:', classroomId, email);

    if (!classroomId || !email) {
      toast.error('Please fill in both fields.');
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_URL}/classroom/${classroomId}/invite`, {
        email,
      });

      toast.success(response.data.message || 'Invitation sent successfully!');
      setEmail("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || 'Failed to send the invitation.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null

  return (
    <div
      className={`absolute top-0 left-full ml-12 bg-white rounded-md shadow-lg p-4 w-64 z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
      }`}
      aria-hidden={!isOpen}
    >
            <Toaster position="top-right"/>
      <h2 className="text-lg font-semibold mb-4">Invite to Classroom</h2>
      <p className="mb-4">Invite Code: {inviteCode}</p>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4"
          required
          aria-label="Email address for invitation"
        />
        <Button type="submit" className="w-full">
          Send Invite
        </Button>
      </form>
      <Button variant="outline" onClick={onClose} className="mt-4 w-full">
        Close
      </Button>
    </div>
  )
}
export default InviteModal

