using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Web.Controllers
{
    //[Authorize(Policy = Constants.LeanPolicy)]
    [ApiController]
    [Route("api/leagues")]
    public class StatsController : ControllerBase
    {
        private readonly CompetifyDbContext _db;

        public StatsController(CompetifyDbContext dbContext)
        {
            _db = dbContext;
        }

        [HttpGet("{leagueId}/stats")]
        public async Task<IActionResult> Stats(int leagueId)
        {
            var league = await _db
                .Leagues
                .Include(x => x.Competitors)
                .FirstOrDefaultAsync(x => x.Id == leagueId);

            if (league is null) return NotFound();

            string mostHeadsUpMatchesString = HeadsUpStats(league);

            return new JsonResult(new
            {
                MostHeadsUpMatches = mostHeadsUpMatchesString
            });
        }

        private static string HeadsUpStats(League league)
        {
            var grouping = league.Rounds.GroupBy(r =>
            {
                var min = Math.Min(r.CompetitorA, r.CompetitorB);
                var max = Math.Max(r.CompetitorA, r.CompetitorB);
                return $"{min}-{max}";
            }).OrderByDescending(x => x.Count());

            var mostHeadsUpMatches = grouping.First().Key.Split('-');
            var mostHeadsUpCompetitorA = league.Competitors.First(x => x.Id == int.Parse(mostHeadsUpMatches[0]));
            var mostHeadsUpCompetitorB = league.Competitors.First(x => x.Id == int.Parse(mostHeadsUpMatches[1]));
            string mostHeadsUpMatchesString = $"{mostHeadsUpCompetitorA.Name} vs {mostHeadsUpCompetitorB.Name} {grouping.First().Count()} times";
            return mostHeadsUpMatchesString;
        }
    }
}
