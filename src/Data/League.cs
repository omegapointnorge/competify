using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Data
{
    public class League : Entity
    {
        public string Name { get; set; }
        public string Passphrase { get; set; }
        public ICollection<Competitor> Competitors { get; set; }
        public ICollection<Round> Rounds { get; set; }
    }

    public static class LeagueEx {
        public static LeagueSummary Summary(this League league)
        {
            return new LeagueSummary
            {
                Id = league.Id,
                Name = league.Name,
                Competitors = league.Competitors?.Select(c => c.Summary()).OrderByDescending(c => c.Rating).ToList(),
                Rounds = league.Rounds?.Select(r => r.Summary()).OrderByDescending(r => r.Created)/*.Take(10)*/.ToList(),
            };
        }
    }

    public class LeagueSummary
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IList<CompetitorSummary> Competitors { get; set; }
        public IList<RoundSummary> Rounds { get; set; }
    }
}
