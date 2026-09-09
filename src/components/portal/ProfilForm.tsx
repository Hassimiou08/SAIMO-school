"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, KeyRound, Loader2, Camera, Trash2, PenLine } from "lucide-react";
import { Champ } from "@/components/portal/_ui";
import { SignaturePad } from "@/components/portal/SignaturePad";
import { actionMajProfil, actionChangerMotDePasse } from "@/server/actions/profil";

export interface ProfilData {
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  photo: string | null;
  signature: string | null;
  role: string;
}

// Redimensionne l'image choisie en un carré <= 256px et renvoie un data URI JPEG.
function fichierVersDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Lecture du fichier impossible"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image illisible"));
      img.onload = () => {
        const taille = 256;
        const canvas = document.createElement("canvas");
        canvas.width = taille;
        canvas.height = taille;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponible"));
        const cote = Math.min(img.width, img.height);
        const sx = (img.width - cote) / 2;
        const sy = (img.height - cote) / 2;
        ctx.drawImage(img, sx, sy, cote, cote, 0, 0, taille, taille);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function Avatar({ src, nom }: { src: string | null; nom: string }) {
  const initiales = nom
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase())
    .join("");
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={nom}
        className="h-20 w-20 rounded-2xl object-cover border border-neutral-200"
      />
    );
  }
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 font-display text-xl font-bold text-white">
      {initiales}
    </div>
  );
}

export function ProfilForm({
  profil,
  afficherSignature = true,
}: {
  profil: ProfilData;
  /** Désactivé pour les rôles qui n'apparaissent jamais sur un bulletin (parent, élève). */
  afficherSignature?: boolean;
}) {
  const router = useRouter();
  const [infosPending, startInfos] = useTransition();
  const [mdpPending, startMdp] = useTransition();

  const [erreurInfos, setErreurInfos] = useState("");
  const [erreurMdp, setErreurMdp] = useState("");

  const [photo, setPhoto] = useState<string | null>(profil.photo);
  const [photoChargement, setPhotoChargement] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [signature, setSignature] = useState<string | null>(profil.signature);

  const choisirFichier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de re-sélectionner le même fichier
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Choisissez un fichier image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image trop lourde (10 Mo max).");
      return;
    }
    setPhotoChargement(true);
    try {
      setPhoto(await fichierVersDataUri(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Traitement de l'image impossible");
    } finally {
      setPhotoChargement(false);
    }
  };

  const majInfos = (fd: FormData) => {
    setErreurInfos("");
    fd.set("photo", photo ?? "");
    fd.set("signature", signature ?? "");
    startInfos(async () => {
      const r = await actionMajProfil(fd);
      if (!r.succes) {
        setErreurInfos(r.erreur);
        toast.error(r.erreur);
      } else {
        toast.success("Profil mis à jour");
        router.refresh();
      }
    });
  };

  const changerMdp = (fd: FormData) => {
    setErreurMdp("");
    startMdp(async () => {
      const r = await actionChangerMotDePasse(fd);
      if (!r.succes) {
        setErreurMdp(r.erreur);
        toast.error(r.erreur);
      } else {
        toast.success("Mot de passe modifié");
        (document.getElementById("form-mdp") as HTMLFormElement | null)?.reset();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Informations personnelles */}
      <form action={majInfos} className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-navy-900">
          <User className="h-4 w-4" /> Informations personnelles
        </h2>
        <p className="mb-5 text-xs text-ink-500">Rôle : {profil.role}</p>

        {/* Photo */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <Avatar src={photo} nom={`${profil.prenom} ${profil.nom}`} />
            {photoChargement && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
            >
              <Camera className="h-3.5 w-3.5" /> Changer la photo
            </button>
            {photo && (
              <button
                type="button"
                onClick={() => setPhoto(null)}
                className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Retirer
              </button>
            )}
            <p className="text-[11px] text-neutral-400">JPG, PNG ou WebP — recadrée en 256×256.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={choisirFichier}
            className="hidden"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Champ name="prenom" label="Prénom" defaultValue={profil.prenom} required />
          <Champ name="nom" label="Nom" defaultValue={profil.nom} required />
          <Champ
            name="email"
            label="E-mail (identifiant de connexion)"
            type="email"
            defaultValue={profil.email}
            required
          />
          <Champ
            name="telephone"
            label="Téléphone"
            defaultValue={profil.telephone ?? ""}
            placeholder="+224 6XX XX XX XX"
          />
        </div>

        {/* Signature manuscrite — uniquement pour les rôles qui signent un bulletin */}
        {afficherSignature && (
          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <PenLine className="h-4 w-4" /> Ma signature
            </label>
            <p className="mb-2 mt-0.5 text-xs text-ink-500">
              Tracez votre signature à la souris ou au doigt. Elle apparaîtra sur les bulletins
              que vous validez (et sur ceux de vos classes si vous êtes professeur principal).
            </p>
            <SignaturePad value={signature} onChange={setSignature} />
          </div>
        )}

        {erreurInfos && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">
            {erreurInfos}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={infosPending || photoChargement}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {infosPending && <Loader2 className="h-4 w-4 animate-spin" />} Enregistrer
          </button>
        </div>
      </form>

      {/* Mot de passe */}
      <form
        id="form-mdp"
        action={changerMdp}
        className="rounded-2xl border border-neutral-200 bg-white p-6"
      >
        <h2 className="mb-1 flex items-center gap-2 font-display text-sm font-bold text-navy-900">
          <KeyRound className="h-4 w-4" /> Mot de passe
        </h2>
        <p className="mb-5 text-xs text-ink-500">
          8 caractères minimum, avec majuscule, minuscule et chiffre.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Champ name="actuel" label="Mot de passe actuel" type="password" required />
          <Champ name="nouveau" label="Nouveau mot de passe" type="password" required />
          <Champ name="confirmation" label="Confirmer" type="password" required />
        </div>

        {erreurMdp && (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">
            {erreurMdp}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={mdpPending}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-800 disabled:opacity-60"
          >
            {mdpPending && <Loader2 className="h-4 w-4 animate-spin" />} Changer le mot de passe
          </button>
        </div>
      </form>
    </div>
  );
}
