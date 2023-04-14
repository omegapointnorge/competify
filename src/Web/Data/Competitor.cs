using System;

namespace Data
{
    public class Competitor : Entity
    {
        public string Name { get; set; }
        public int Rating { get; set; }
        public bool IsPrivateMatches { get; set; }
        public int LeagueId { get; set; }
        public League League { get; set; }
        public int WinStreak { get; set; }

        internal void UpdateWinStreak(bool competitorWon)
        {
            if (WinStreak > 0 && competitorWon) WinStreak++;
            else if (WinStreak < 0 && !competitorWon) WinStreak--;
            else WinStreak = competitorWon ? 1 : -1;
        }
    }


    public static class CompetitorEx
    {
        public static CompetitorSummary Summary(this Competitor competitor, ICollection<Round> rounds)
        {
            var dominated = rounds
                .Where(r => (r.Reaction == Reaction.B_DOMINATED && r.CompetitorA == competitor.Id) || (r.Reaction == Reaction.A_DOMINATED && r.CompetitorB == competitor.Id))
                .Where(r => r.Created > DateTime.Now.AddDays(-10));
            var dominations = rounds.Where(r => (r.Reaction == Reaction.A_DOMINATED && r.CompetitorA == competitor.Id) ||
                                              (r.Reaction == Reaction.B_DOMINATED && r.CompetitorB == competitor.Id));


            return new CompetitorSummary
            {
                Id = competitor.Id,
                Name = competitor.Name,
                Rating = competitor.Rating,
                WinStreak = competitor.WinStreak,
                Dominated = dominated.Any(),
                Dominations = dominations.Count(),
                IsPrivateMatches = competitor.IsPrivateMatches
            };
        }

    }

    public class CompetitorSummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public int WinStreak { get; internal set; }
        public bool Dominated { get; set; }
        public int Dominations { get; set; }
        public bool IsPrivateMatches { get; set; }
    }
}
