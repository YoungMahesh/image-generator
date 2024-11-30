"use client";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function HomePage() {
  const [text, setText] = useState("create");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#10B981");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [fontSize, setFontSize] = useState(45);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: null,
        removeContainer: true,
      });
      const link = document.createElement("a");
      const fileName = text.trim()
        ? `${text.trim()}.png`
        : "generated-image.png";
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="font-['Segoe_UI'],_system-ui,_-apple-system,_Helvetica mb-8 text-2xl font-bold tracking-tight">
        Image Generator
      </h1>
      <div className="flex min-h-[calc(100vh-160px)] items-center">
        <div className="mx-auto w-full max-w-4xl">
          {/* Section 1 */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Preview Box */}
            <div className="inline-block rounded-lg">
              <div
                ref={previewRef}
                className="flex items-center justify-center"
                style={{
                  backgroundColor,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              >
                <p style={{ color: textColor, fontSize: `${fontSize}px` }}>
                  {text}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">Text</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded border p-2"
                    placeholder="Enter text to display"
                  />
                </div>
                <div className="w-24">
                  <label className="mb-1 block text-sm font-medium">
                    Font Size
                  </label>
                  <input
                    type="number"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full rounded border p-2"
                    min="8"
                    max="200"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full rounded border p-2"
                    min="50"
                    max="1000"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full rounded border p-2"
                    min="50"
                    max="1000"
                  />
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
