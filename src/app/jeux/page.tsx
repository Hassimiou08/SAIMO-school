"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brain, Calculator, Trophy, Lock, Play, ArrowRight, X } from "lucide-react";

// --- Données des Jeux ---
const MATH_QUESTIONS = [
  { q: "Combien font 7 × 8 ?", options: ["54", "56", "64", "48"], answer: "56" },
  { q: "Quel est le quart de 100 ?", options: ["20", "25", "50", "15"], answer: "25" },
  { q: "12 + 15 + 8 = ?", options: ["35", "33", "36", "34"], answer: "35" },
  { q: "Combien de minutes dans 3 heures ?", options: ["120", "150", "180", "200"], answer: "180" },
  { q: "9 × 9 = ?", options: ["81", "90", "72", "99"], answer: "81" },
];

const CULTURE_QUESTIONS = [
  { q: "Quelle est la capitale de la Guinée ?", options: ["Dakar", "Conakry", "Bamako", "Abidjan"], answer: "Conakry" },
  { q: "Quel est le plus grand continent du monde ?", options: ["L'Afrique", "L'Europe", "L'Asie", "L'Amérique"], answer: "L'Asie" },
  { q: "Combien de couleurs y a-t-il dans l'arc-en-ciel ?", options: ["5", "6", "7", "8"], answer: "7" },
  { q: "Quel est l'océan le plus vaste ?", options: ["Atlantique", "Pacifique", "Indien", "Arctique"], answer: "Pacifique" },
  { q: "Qui a peint la Joconde ?", options: ["Picasso", "Van Gogh", "Léonard de Vinci", "Monet"], answer: "Léonard de Vinci" },
];

export default function JeuxPage() {
  const [activeGame, setActiveGame] = useState<"math" | "culture" | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [playedGames, setPlayedGames] = useState<string[]>([]);

  // Charger les jeux déjà joués depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("saimo-played-games");
    if (saved) {
      try {
        setPlayedGames(JSON.parse(saved));
      } catch (e) {
        setPlayedGames([]);
      }
    }
  }, []);

  const startGame = (gameType: "math" | "culture") => {
    setActiveGame(gameType);
    setCurrentQ(0);
    setScore(0);
    setShowResult(false);
  };

  const handleAnswer = (answer: string) => {
    const questions = activeGame === "math" ? MATH_QUESTIONS : CULTURE_QUESTIONS;
    if (answer === questions[currentQ].answer) {
      setScore(s => s + 1);
    }
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      // Fin de la partie
      setShowResult(true);
      if (activeGame && !playedGames.includes(activeGame)) {
        const newPlayedGames = [...playedGames, activeGame];
        setPlayedGames(newPlayedGames);
        localStorage.setItem("saimo-played-games", JSON.stringify(newPlayedGames));
      }
    }
  };

  const quitGame = () => {
    setActiveGame(null);
  };

  const hasPlayedMath = playedGames.includes("math");
  const hasPlayedCulture = playedGames.includes("culture");
  const maxLimitReached = playedGames.length >= 2;

  return (
    <div className="min-h-screen bg-[#FDF8F0] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-16 px-6 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-16 z-10">
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-navy-900 mb-4">
            Espace <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Jeux SAIMO</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Apprendre en s'amusant ! Teste tes connaissances avec nos mini-jeux éducatifs. 
            Les visiteurs ont droit à 2 parties gratuites.
          </p>
        </div>

        {/* ========================================= */}
        {/*           MENU DE SÉLECTION               */}
        {/* ========================================= */}
        {!activeGame && (
          <div className="w-full max-w-4xl z-10 flex flex-col items-center gap-8">
            
            {maxLimitReached ? (
              <div className="w-full max-w-2xl bg-white rounded-3xl p-10 text-center shadow-xl border border-neutral-200 relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-orange-500" />
                <div className="mx-auto w-24 h-24 bg-blue-50 border-4 border-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-6">
                  <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-display font-bold text-navy-900 mb-4">Limites de démo atteintes</h3>
                <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed">
                  Bravo ! Tu as testé toutes les parties gratuites. <br/> 
                  Pour découvrir plus de jeux et continuer à apprendre en t'amusant, connecte-toi à ton espace !
                </p>
                <Link 
                  href="/connexion/visiteurs"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-lg"
                >
                  Me connecter pour continuer <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="mt-6 text-sm text-slate-400">
                  Pas encore élève à SAIMO ? <Link href="/sections/preinscription" className="text-orange-500 font-bold hover:underline">S'inscrire</Link>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {/* JEU MATHS (masqué si déjà joué) */}
                {!hasPlayedMath && (
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl shadow-blue-900/5 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Calculator className="w-32 h-32 text-blue-600" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl mb-6">
                        <Calculator className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-navy-900 mb-2">Quiz Mathématique</h2>
                      <p className="text-slate-500 mb-8 min-h-[48px]">
                        Calcule mentalement le plus vite possible. Additions, multiplications et logique !
                      </p>
                      <button
                        onClick={() => startGame("math")}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                      >
                        <Play className="w-5 h-5" />
                        Jouer maintenant
                      </button>
                    </div>
                  </div>
                )}

                {/* JEU CULTURE (masqué si déjà joué) */}
                {!hasPlayedCulture && (
                  <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl shadow-orange-900/5 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Brain className="w-32 h-32 text-orange-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-2xl mb-6">
                        <Brain className="w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-bold text-navy-900 mb-2">Culture Générale</h2>
                      <p className="text-slate-500 mb-8 min-h-[48px]">
                        Histoire, géographie, sciences... Découvre si tu es incollable !
                      </p>
                      <button
                        onClick={() => startGame("culture")}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                      >
                        <Play className="w-5 h-5" />
                        Jouer maintenant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================= */}
        {/*               INTERFACE JEU               */}
        {/* ========================================= */}
        {activeGame && (
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-300">
            {/* Header du jeu */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${activeGame === "math" ? "bg-blue-50 border-blue-100 text-blue-900" : "bg-orange-50 border-orange-100 text-orange-900"}`}>
              <div className="flex items-center gap-3">
                {activeGame === "math" ? <Calculator className="w-6 h-6 text-blue-600" /> : <Brain className="w-6 h-6 text-orange-600" />}
                <h2 className="font-bold text-lg">
                  {activeGame === "math" ? "Quiz Mathématique" : "Culture Générale"}
                </h2>
              </div>
              <button onClick={quitGame} className="p-2 hover:bg-black/5 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {!showResult ? (
                <>
                  <div className="flex justify-between items-center mb-8 text-sm font-bold text-slate-400">
                    <span>Question {currentQ + 1} / {(activeGame === "math" ? MATH_QUESTIONS : CULTURE_QUESTIONS).length}</span>
                    <span>Score : {score}</span>
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-display font-bold text-center text-navy-900 mb-10">
                    {(activeGame === "math" ? MATH_QUESTIONS : CULTURE_QUESTIONS)[currentQ].q}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(activeGame === "math" ? MATH_QUESTIONS : CULTURE_QUESTIONS)[currentQ].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className={`py-4 px-6 text-lg font-bold rounded-2xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${
                          activeGame === "math" 
                            ? "border-blue-100 text-blue-700 bg-blue-50/50 hover:bg-blue-600 hover:border-blue-600 hover:text-white" 
                            : "border-orange-100 text-orange-700 bg-orange-50/50 hover:bg-orange-500 hover:border-orange-500 hover:text-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 animate-in fade-in zoom-in-95">
                  <div className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full mb-6 ${score >= 3 ? "bg-emerald-100 text-emerald-500" : "bg-red-100 text-red-500"}`}>
                    <Trophy className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-navy-900 mb-2">Partie terminée !</h3>
                  <p className="text-slate-600 text-lg mb-8">
                    Tu as obtenu <strong className="text-2xl text-navy-900">{score}</strong> bonnes réponses sur 5.
                  </p>
                  <button
                    onClick={quitGame}
                    className="inline-flex items-center gap-2 bg-navy-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl transition shadow-lg hover:shadow-xl"
                  >
                    Retourner au menu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
