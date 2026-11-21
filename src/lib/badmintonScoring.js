export const BADMINTON_SCORING_VERSION = 2;

export function isValidTargetPoints(targetPoints) {
  return Number.isInteger(targetPoints) && targetPoints >= 1 && targetPoints <= 30;
}

export function validateGameScore(score1, score2, targetPoints) {
  if (!isValidTargetPoints(targetPoints)) {
    return 'Target poin harus berupa bilangan bulat antara 1 dan 30.';
  }
  if (!Number.isInteger(score1) || !Number.isInteger(score2) || score1 < 0 || score2 < 0) {
    return 'Skor kedua tim harus berupa bilangan bulat nol atau lebih.';
  }
  if (
    (score1 === targetPoints && score2 < targetPoints) ||
    (score2 === targetPoints && score1 < targetPoints)
  ) {
    return null;
  }
  return `Salah satu tim harus mencapai tepat ${targetPoints} poin, dan skor lawan harus di bawah target.`;
}

export function getMatchWinner(match, configuredTargetPoints) {
  if (!match || !Number.isInteger(match.score1) || !Number.isInteger(match.score2)) return null;

  if (match.scoringVersion !== BADMINTON_SCORING_VERSION) {
    if (match.score1 > match.score2) return 1;
    if (match.score2 > match.score1) return 2;
    return 0;
  }

  const targetPoints = match.targetPoints ?? configuredTargetPoints;
  if (validateGameScore(match.score1, match.score2, targetPoints)) return null;
  return match.score1 === targetPoints ? 1 : 2;
}

export function isMatchComplete(match, configuredTargetPoints) {
  return getMatchWinner(match, configuredTargetPoints) !== null;
}
