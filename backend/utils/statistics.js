function filterByTournament(matches, tournamentId) {
  if (!tournamentId) return matches;
  return matches.filter(
    (match) => match.tournament?.toString() === tournamentId,
  );
}

export function computeSummary(matches, tournamentId) {
  const scopedMatches = filterByTournament(matches, tournamentId);
  const finishedMatches = scopedMatches.filter(
    (match) => match.status === "finalizado",
  );
  const scheduledCount = scopedMatches.filter(
    (match) => match.status === "programado",
  ).length;
  const cancelledCount = scopedMatches.filter(
    (match) => match.status === "cancelado",
  ).length;

  const totalGoals = finishedMatches.reduce(
    (sum, match) => sum + (match.localGoals || 0) + (match.visitorGoals || 0),
    0,
  );

  const avgGoals =
    finishedMatches.length > 0
      ? (totalGoals / finishedMatches.length).toFixed(2)
      : "0.00";

  const totalYellowCards = finishedMatches.reduce(
    (sum, match) =>
      sum +
      (match.cards ?? []).filter((card) => card.cardType === "amarilla").length,
    0,
  );
  const totalRedCards = finishedMatches.reduce(
    (sum, match) =>
      sum +
      (match.cards ?? []).filter((card) => card.cardType === "roja").length,
    0,
  );

  return {
    totalMatches: scopedMatches.length,
    finishedCount: finishedMatches.length,
    scheduledCount,
    cancelledCount,
    totalGoals,
    avgGoals,
    totalYellowCards,
    totalRedCards,
  };
}

export function computeStandings(matches, teams, tournamentId) {
  const finishedMatches = filterByTournament(matches, tournamentId).filter(
    (match) => match.status === "finalizado",
  );

  const standings = teams
    .map((team) => {
      const teamMatches = finishedMatches.filter(
        (match) =>
          team._id.equals(match.localTeam) ||
          team._id.equals(match.visitorTeam),
      );

      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      let yellowCards = 0;
      let redCards = 0;

      for (const match of teamMatches) {
        const playedAsLocal = team._id.equals(match.localTeam);
        const goalsScored = playedAsLocal
          ? match.localGoals
          : match.visitorGoals;
        const goalsConceded = playedAsLocal
          ? match.visitorGoals
          : match.localGoals;

        goalsFor += goalsScored;
        goalsAgainst += goalsConceded;

        if (goalsScored > goalsConceded) won += 1;
        else if (goalsScored === goalsConceded) drawn += 1;
        else lost += 1;

        const teamSide = playedAsLocal ? "local" : "visitor";
        for (const card of match.cards ?? []) {
          if (card.team !== teamSide) continue;
          if (card.cardType === "amarilla") yellowCards += 1;
          else if (card.cardType === "roja") redCards += 1;
        }
      }

      return {
        teamId: team._id.toString(),
        name: team.name,
        logoUrl: team.logoUrl,
        played: teamMatches.length,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: won * 3 + drawn,
        yellowCards,
        redCards,
      };
    })
    .sort((teamA, teamB) => {
      if (teamB.points !== teamA.points) {
        return teamB.points - teamA.points;
      }
      if (teamB.goalDifference !== teamA.goalDifference) {
        return teamB.goalDifference - teamA.goalDifference;
      }
      return teamB.goalsFor - teamA.goalsFor;
    })
    .map((row, index) => ({ ...row, position: index + 1 }));

  return standings;
}
