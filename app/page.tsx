'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Camera, Upload, Loader2, RefreshCcw, Menu, X } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY!);

  // Rest of the state handlers remain the same...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            setFile(file);
            setPreview(canvas.toDataURL('image/jpeg'));
          }
        }, 'image/jpeg');

        stream.getTracks().forEach(track => track.stop());
      }, 3000);
    } catch (err) {
      setError('Failed to access camera. Please make sure you have granted camera permissions.');
    }
  };

  const analyzeImage = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Image = reader.result?.toString().split(',')[1];

        if (!base64Image) {
          throw new Error('Failed to process image');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const imageParts = [{
          inlineData: {
            data: base64Image,
            mimeType: file.type
          }
        }];

        const prompt = "Analyze this image and provide detailed information about the object(s) in it. Include: 1) Main object name and category 2) Key features and characteristics 3) Possible uses or applications 4) Any notable details or patterns. Be specific but concise.";

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        setResult(response.text());
      };
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-gray-300">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="/" className="text-white font-bold text-xl">Object Identifier</a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="/about" className="text-white hover:text-gray-200 transition-colors">About</a>
              <a href="/contact" className="text-white hover:text-gray-200 transition-colors">Contact</a>
              <a href="/terms" className="text-white hover:text-gray-200 transition-colors">Terms</a>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a
                  href="/about"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  Contact
                </a>
                <a
                  href="/terms"
                  className="block text-white hover:bg-white/10 rounded-md px-3 py-2 transition-colors"
                >
                  Terms
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="p-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Main Content Section */}
          <div className="text-center pt-8">
            <h1 className="text-4xl font-bold text-white mb-2">Identify Any Object</h1>
            <p className="text-gray-100">Upload or capture an image to identify objects using AI</p>
          </div>

          {/* Main Card Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 space-y-6">
            {/* Preview Area */}
            {preview ? (
              <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image selected</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              <button
                onClick={() => document.getElementById('file-upload')?.click()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={startCamera}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
            </div>

            {/* Analysis Button */}
            {preview && (
              <div className="flex gap-3">
                <button
                  onClick={analyzeImage}
                  disabled={isAnalyzing || !preview}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Image'
                  )}
                </button>
                <button
                  onClick={resetAll}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
                <div className="prose prose-sm">
                  {result.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}