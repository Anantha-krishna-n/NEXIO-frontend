"use client"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Share2 } from 'lucide-react'

export default function DocumentsPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <div className="flex justify-between items-center mb-4">
        <p>All your classroom documents are stored here.</p>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>
      <div className="space-y-4">
        {['Lesson Plan.pdf', 'Homework Assignment.docx', 'Project Guidelines.pptx'].map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              <span>{doc}</span>
            </div>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

