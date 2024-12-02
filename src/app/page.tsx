"use client";
import { useState, useRef } from "react";
import JSZip from "jszip";

export default function HomePage() {
  const [text, setText] = useState("create");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#10B981");
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(300);
  const [fontSize, setFontSize] = useState(45);
  const [isMultiple, setIsMultiple] = useState(false);
  const [multipleTexts, setMultipleTexts] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  const generateImage = async (text: string) => {
    if (!previewRef.current) return null;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Configure text style
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px 'Segoe UI', system-ui, -apple-system, Helvetica`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text in the center
    ctx.fillText(text, width / 2, height / 2);

    return canvas;
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;

    if (!isMultiple) {
      const canvas = await generateImage(text);
      if (canvas) {
        const link = document.createElement("a");
        const fileName = text.trim() ? `${text.trim()}.png` : "generated-image.png";
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } else {
      const texts = multipleTexts.split("\n").filter(t => t.trim());
      if (texts.length === 0) return;

      const zip = new JSZip();
      
      // Generate all images
      for (let i = 0; i < texts.length; i++) {
        const currentText = texts[i]?.trim();
        if(!currentText) continue;
        const canvas = await generateImage(currentText);
        if (canvas) {
          const imageData = canvas.toDataURL("image/png").split(",")[1];
          if(!imageData) continue;
          zip.file(`${currentText || `image-${i + 1}`}.png`, imageData, { base64: true });
        }
      }

      // Download zip file
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.download = "generated-images.zip";
      link.href = URL.createObjectURL(content);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  const copyFieldValues = () => {
    const values = {
      text: isMultiple ? multipleTexts : text,
      fontSize: `${fontSize}px`,
      textColor,
      backgroundColor,
      width: `${width}px`,
      height: `${height}px`,
    };
    navigator.clipboard.writeText(JSON.stringify(values, null, 2))
      .then(() => {
        alert('Field values copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy values:', err);
        alert('Failed to copy values to clipboard');
      });
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="font-['Segoe_UI'],_system-ui,_-apple-system,_Helvetica mb-8 text-2xl font-bold tracking-tight">
        Image Generator
      </h1>
      <div className="flex min-h-[calc(100vh-160px)] items-center">
        <main className="mx-auto w-full max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Preview Box */}
            <div className="inline-block rounded-lg">
              <div
                ref={previewRef}
                className="relative"
                style={{
                  backgroundColor,
                  width: `${width}px`,
                  height: `${height}px`,
                }}
              >
                <p 
                  style={{ 
                    color: textColor, 
                    fontSize: `${fontSize}px`,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    margin: 0,
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  {text}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isMultiple}
                    onChange={(e) => setIsMultiple(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Generate Multiple Images</span>
                </label>
              </div>

              {!isMultiple ? (
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
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                      Enter Multiple Texts (one per line)
                    </label>
                    <textarea
                      value={multipleTexts}
                      onChange={(e) => setMultipleTexts(e.target.value)}
                      className="w-full rounded border p-2"
                      rows={5}
                      placeholder="Enter each text on a new line"
                    />
                  </div>
                  <div className="mb-4">
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
              )}

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
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={copyFieldValues}
                  className="flex-1 rounded border-2 border-blue-600 px-6 py-2 text-blue-600 transition-colors hover:bg-blue-100"
                >
                  Copy Field Values
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-1 rounded bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
