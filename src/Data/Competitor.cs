using System;

namespace Web.Data
{
    public class Competitor : Entity
    {
        public string Name { get; set; }
        public int Rating { get; set; }

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
        public static CompetitorSummary Summary(this Competitor competitor)
        {
            return new CompetitorSummary
            {
                Id = competitor.Id,
                Name = competitor.Name,
                Rating = competitor.Rating,
                WinStreak = competitor.WinStreak
            };
        }

    }

    public class CompetitorSummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Rating { get; set; }
        public int WinStreak { get; internal set; }
    }
}
