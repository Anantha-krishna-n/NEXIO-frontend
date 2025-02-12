"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Share2 } from "lucide-react";
import axiosInstance from "@/app/utils/axiosInstance";
import { useEdgeStore } from "../../../../lib/edgestore";
import { Progress } from "@/components/ui/progress";
import type React from "react"; // Added import for React

interface Document {
  _id: string;
  title: string;
  fileUrl: string;
}

export default function DocumentsPage() {
  const params = useParams();
  const classroomId = params.Id as string;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get(`/document/${classroomId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileTitle(selectedFile.name);

      // Create preview
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        setFilePreview("/pdf-icon.png"); // Replace with your PDF icon path
      } else if (selectedFile.type.startsWith("video/")) {
        setFilePreview("/video-icon.png"); // Replace with your video icon path
      } else {
        setFilePreview("/file-icon.png"); // Replace with a generic file icon path
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
      });

      console.log("File uploaded:", res);

      // Send POST request to backend
      await axiosInstance.post(`/document/upload`, {
        title: fileTitle,
        classroomId: classroomId,
        fileUrl: res.url,
      });

      // Refresh documents list
      await fetchDocuments();

      // Clear upload state
      setFile(null);
      setFilePreview(null);
      setFileTitle("");
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDoc = async (id: string, url: string) => {
    try {
      // await edgestore.publicFiles.delete({
      //   url: url,
      // });
      await axiosInstance.delete(`/document/${id}`);
      await fetchDocuments();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <div className="flex justify-between items-center mb-4">
        <p>All your classroom documents are stored here.</p>
        <Button disabled={isUploading}>
          <label className="cursor-pointer flex items-center">
            <Upload className="mr-2 h-4 w-4" />
            <span>{isUploading ? "Uploading..." : "Upload"}</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>

      {file && (
        <div className="mb-4 p-4 border rounded-md">
          <div className="flex items-center mb-2">
            {filePreview && (
              <img
                src={filePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-16 h-16 object-cover mr-4"
              />
            )}
            <input
              type="text"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className="flex-grow p-2 border rounded"
              placeholder="Enter file title"
            />
          </div>
          <Button onClick={handleFileUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Add"}
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="mb-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-center mt-2">{uploadProgress.toFixed(0)}%</p>
        </div>
      )}

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              <span>{doc.title}</span>
            </div>
            <div className="flex gap-4">
              <button
                className="rounded-sm py-2 px-3 bg-red-600 text-gray-200 "
                onClick={() => handleDeleteDoc(doc._id, doc.fileUrl)}
              >
                Delete
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(doc.fileUrl, "_blank")}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
