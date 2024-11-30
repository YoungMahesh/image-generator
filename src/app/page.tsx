"use client";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";

export default function HomePage() {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      const link = document.createElement("a");
      link.download = "generated-image.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Section 1 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Preview Box */}
          <div
            ref={previewRef}
            className="flex aspect-square items-center justify-center rounded-lg border p-4 shadow-md"
            style={{
              backgroundColor,
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            <p style={{ color: textColor }}>{text}</p>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Enter text to display"
              />
            </div>
            <div>
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
            <div>
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
        </div>

        {/* Section 2 */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Width (px)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-24 rounded border p-2"
                min="50"
                max="1000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-24 rounded border p-2"
                min="50"
                max="1000"
              />
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Download Image
          </button>
        </div>
      </div>
    </main>
  );
}
