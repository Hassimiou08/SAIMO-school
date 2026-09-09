"use client";

import { useEffect, useRef, useState } from "react";
import { Eraser, PenLine } from "lucide-react";

/**
 * Zone de signature manuscrite (souris / tactile).
 * Émet un PNG transparent en data URI via `onChange` (null si effacée).
 */
export function SignaturePad({
  value,
  onChange,
  width = 420,
  height = 150,
}: {
  value: string | null;
  onChange: (dataUri: string | null) => void;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dessine = useRef(false);
  const dernier = useRef<{ x: number; y: number } | null>(null);
  const [vide, setVide] = useState(!value);

  // Prépare le canvas (résolution nette) et précharge la signature existante.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";

    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, width, height);
      img.src = value;
      setVide(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    dessine.current = true;
    dernier.current = pos(e);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: React.PointerEvent) => {
    if (!dessine.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !dernier.current) return;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(dernier.current.x, dernier.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    dernier.current = p;
    setVide(false);
  };

  const end = () => {
    if (!dessine.current) return;
    dessine.current = false;
    dernier.current = null;
    const canvas = canvasRef.current;
    if (canvas) onChange(canvas.toDataURL("image/png"));
  };

  const effacer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setVide(true);
    onChange(null);
  };

  return (
    <div>
      <div className="inline-block rounded-xl border border-neutral-300 bg-white">
        <canvas
          ref={canvasRef}
          style={{ width, height, touchAction: "none" }}
          className="cursor-crosshair rounded-xl"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
        <PenLine className="h-3.5 w-3.5" />
        <span>{vide ? "Signez dans le cadre" : "Signature enregistrée à l'enregistrement du profil"}</span>
        <button
          type="button"
          onClick={effacer}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold text-red-600 hover:bg-red-50"
        >
          <Eraser className="h-3.5 w-3.5" /> Effacer
        </button>
      </div>
    </div>
  );
}
