export function computeStats(matches, teams) {
  const finishedMatches = matches.filter(
    (match) => match.status === "finalizado",
  );

  const totalGoals = finishedMatches.reduce(
    (sum, match) => sum + (match.localGoals || 0) + (match.visitorGoals || 0),
    0,
  );

  const standings = teams
    .map((team) => {
      const teamMatches = finishedMatches.filter(
        (match) =>
          match.localTeamId === team.id || match.visitorTeamId === team.id,
      );

      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      for (const match of teamMatches) {
        const playedAsLocal = match.localTeamId === team.id;
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
      }

      return {
        teamId: team.id,
        name: team.name,
        logo: team.logo,
        played: teamMatches.length,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: won * 3 + drawn,
      };
    })
    .sort((teamA, teamB) => {
      // Orden: primero por puntos. Si empatan, por diferencia de gol.
      // Si siguen empatados, por goles a favor. (de mayor a menor)
      if (teamB.points !== teamA.points) {
        return teamB.points - teamA.points;
      }
      if (teamB.goalDifference !== teamA.goalDifference) {
        return teamB.goalDifference - teamA.goalDifference;
      }
      return teamB.goalsFor - teamA.goalsFor;
    });

  const scheduledCount = matches.filter(
    (match) => match.status === "programado",
  ).length;
  const cancelledCount = matches.filter(
    (match) => match.status === "cancelado",
  ).length;

  let avgGoals = "0.00";
  if (finishedMatches.length > 0) {
    avgGoals = (totalGoals / finishedMatches.length).toFixed(2);
  }

  return {
    totalMatches: matches.length,
    finishedCount: finishedMatches.length,
    scheduledCount,
    cancelledCount,
    totalGoals,
    avgGoals,
    standings,
  };
}
