import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTournamentStore } from '../store/useTournamentStore';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../store/useToastStore';
import {
  BADMINTON_SCORING_VERSION,
  validateGameScore
} from '../lib/badmintonScoring.js';

export default function ScoreModal({ isOpen, matchKey, onClose }) {
  const { matches, isHost } = useTournamentStore();
  const match = matchKey ? matches[matchKey] : null;

  if (!isOpen || !matchKey || !match || !isHost) return null;

  return createPortal(
    <ScoreEditor matchKey={matchKey} match={match} onClose={onClose} />,
    document.body
  );
}

function ScoreEditor({ matchKey, match, onClose }) {
  const { config, players, customCourtNames, setScore } = useTournamentStore();
  const [score1, setScore1] = useState(match.score1 === null ? '' : String(match.score1));
  const [score2, setScore2] = useState(match.score2 === null ? '' : String(match.score2));

  const hasMissingPlayers = [...match.t1, ...match.t2].some((id) => (
    id === null || !players.some((player) => player.id === id && !player.isWalkout)
  ));
  const team1Players = match.t1.map((id) => players.find((player) => player.id === id));
  const team2Players = match.t2.map((id) => players.find((player) => player.id === id));
  const courtName = customCourtNames[match.court] || `Court ${match.court}`;
  const targetPoints = match.scoringVersion === BADMINTON_SCORING_VERSION
    ? match.targetPoints
    : config.maxPoints;
  const score1Value = score1.trim() === '' ? NaN : Number(score1);
  const score2Value = score2.trim() === '' ? NaN : Number(score2);
  const validationMessage = validateGameScore(score1Value, score2Value, targetPoints);

  const handleSave = () => {
    if (hasMissingPlayers) {
      toast.error('Lengkapi slot pemain melalui pengaturan pertandingan sebelum memasukkan skor.');
      return;
    }
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }
    if (!setScore(matchKey, score1Value, score2Value)) {
      toast.error('Skor tidak dapat disimpan. Periksa kembali pemain dan hasil pertandingan.');
      return;
    }
    onClose();
  };

  const handleReset = () => {
    if (!setScore(matchKey, null, null)) {
      toast.error('Skor tidak dapat direset.');
      return;
    }
    onClose();
  };

  const renderTeamNames = (teamPlayers) => teamPlayers
    .map((player) => player?.name || 'Pilih Pemain')
    .join(' & ');

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-slate-800 border border-slate-600 rounded-3xl shadow-2xl max-w-md w-full p-5 md:p-6 relative flex flex-col"
        >
          <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white transition bg-slate-700/50 rounded-full p-1.5">
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700/50 pb-3 flex items-center gap-2 tracking-tight">
            Input Score <span className="px-2 py-0.5 rounded shadow-sm border border-slate-600 bg-slate-900/50 text-[12px] align-middle font-mono text-slate-300">{courtName}</span>
          </h3>

          <p className="text-center text-sm text-slate-400 mb-5">
            Game berakhir saat salah satu tim mencapai target {targetPoints} poin.
          </p>

          {hasMissingPlayers ? (
            <p className="text-center text-sm text-amber-300 bg-amber-900/20 border border-amber-800/50 rounded-xl p-3">
              Lengkapi slot pemain melalui pengaturan pertandingan sebelum memasukkan skor.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <label className="flex flex-col gap-2 text-center">
                  <span className="text-sm font-bold text-slate-200 min-h-10 flex items-center justify-center">
                    {renderTeamNames(team1Players)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={targetPoints}
                    step="1"
                    inputMode="numeric"
                    value={score1}
                    onChange={(event) => setScore1(event.target.value)}
                    aria-label={`Skor ${renderTeamNames(team1Players)}`}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-center text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <span className="text-slate-500 font-bold mt-10">VS</span>
                <label className="flex flex-col gap-2 text-center">
                  <span className="text-sm font-bold text-slate-200 min-h-10 flex items-center justify-center">
                    {renderTeamNames(team2Players)}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max={targetPoints}
                    step="1"
                    inputMode="numeric"
                    value={score2}
                    onChange={(event) => setScore2(event.target.value)}
                    aria-label={`Skor ${renderTeamNames(team2Players)}`}
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-center text-2xl font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500 text-center mt-3">
                Masukkan skor aktual kedua tim. Tim pemenang harus tepat mencapai target.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition shadow"
                >
                  Simpan Hasil
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs bg-red-900/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-700/50 py-3 px-8 rounded-xl transition font-bold tracking-widest uppercase"
                >
                  Reset Score
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return modalContent;
}
