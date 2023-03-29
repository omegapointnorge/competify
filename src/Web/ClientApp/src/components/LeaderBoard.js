import React from "react";

const LeaderboardRow = (
    competitor,
    competitorA,
    competitorB,
    removeRoundCompetitor,
    addCompetitorToRound
) => {
    const selectedAsA = competitorA && competitorA.id === competitor.id;
    const selectedAsB = competitorB && competitorB.id === competitor.id;
    const selected = selectedAsA || selectedAsB;

    const onClick = () => {
        if (selectedAsA) {
            removeRoundCompetitor("competitorA");
        } else if (selectedAsB) {
            removeRoundCompetitor("competitorB");
        } else if (!selected) {
            addCompetitorToRound(competitor);
        }
    };
    const className = selected ? "selected onclick-enabled" : "onclick-enabled";
    const winStreak = competitor.winStreak;
    const dominations = competitor.dominations;
    const dominated = competitor.dominated;
    const playerWithTrophy = "sondre";
    return (
        <tr key={competitor.id} className={className} onClick={onClick}>
            <td>
        <span>
          {competitor.name.toLowerCase() === playerWithTrophy && <span>&#x1F3C6;</span>}
            {competitor.name}
        </span>
                {dominations <= 3 &&
                    dominations > 0 &&
                    [...Array(dominations)].map(() => (
                        <span role="img" aria-label="reaction">
              &#x1f525;
            </span>
                    ))}

                {dominations > 3 && (
                    <span style={{fontWeight: "bold"}}>
            &nbsp;{dominations}x
            <span role="img" aria-label="reaction">
              &#x1f525;
            </span>
          </span>
                )}
                {competitor.dominated && (
                    <span role="img" aria-label="reaction">
            &#x1f4a9;
          </span>
                )}
            </td>
            <td>
                <span className="rating">{competitor.rating}</span>
            </td>
            <td>
                {Math.abs(competitor.winStreak) > 2 && (
                    <span className={winStreak > 0 ? "winner" : "loser"}>
            &nbsp;{competitor.winStreak}&nbsp;
          </span>
                )}
            </td>
        </tr>
    );
};

const LeaderBoard = ({
                         competitors,
                         competitorA,
                         competitorB,
                         removeRoundCompetitor,
                         addCompetitorToRound,
                     }) => {
    return (
        <section>
            <p style={{textAlign: "right"}}>
        <span>
          Bonus pool:&nbsp;
            <span className="draw">
            {1500 * competitors.length -
                competitors.map((x) => x.rating).reduce((a, b) => a + b, 0)}
          </span>
        </span>
            </p>
            <table className="leaderboard table table-condensed table-striped">
                <thead>
                <tr>
                    <th>Competitor</th>
                    <th>Rating</th>
                    <th>Streak</th>
                </tr>
                </thead>
                <tbody>
                {competitors.map((c) =>
                    LeaderboardRow(
                        c,
                        competitorA,
                        competitorB,
                        removeRoundCompetitor,
                        addCompetitorToRound
                    )
                )}
                </tbody>
            </table>
        </section>
    );
};

export default LeaderBoard;
