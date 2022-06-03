using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Web.Controllers
{
    //[Authorize(Policy = Constants.LeanPolicy)]
    [Route("api/[controller]")]
    public class LeaguesController : Controller
    {
        private readonly CompetifyDbContext _db;

        public LeaguesController(CompetifyDbContext dbContext)
        {
            _db = dbContext;
        }

        [HttpGet("")]
        public IEnumerable<LeagueSummary> Leagues()
        {
            return _db.Leagues.Select(x => x.Summary());
        }

        [HttpGet("{leagueId}")]
        public async Task<IActionResult> Summary(int leagueId)
        {
            var league = await GetLeagueForSummary(leagueId);
            return new JsonResult(league?.Summary());
        }


        [HttpPost("{leagueId}/Competitor")]
        public async Task<IActionResult> AddCompetitor(int leagueId, [FromBody] AddCompetitorDto request)
        {
            var league = await _db.Leagues.Include(x => x.Competitors).FirstOrDefaultAsync(x => x.Id == leagueId);
            if (league == null)
                return new BadRequestObjectResult(new { Error = "Unable to add competitors to that league" });
            else if (league.Competitors.Any(x => x.Name == request.Name))
                return new BadRequestObjectResult(new { Error = "A competitor with that name already exists" });

            var entity = new Competitor { League = league, Name = request.Name, Rating = 1500 };
            await _db.AddAsync(entity);
            await _db.SaveChangesAsync();

            return Created($"/api/Leagues/{league.Id}/Competitors", entity.Summary());
        }

        public struct AddCompetitorDto
        {
            public string Name { get; set; }
        }

        [HttpPost("{leagueId}/AddRound")]
        public async Task<IActionResult> AddRound(int leagueId, [FromBody] AddRoundDto request)
        {
            var league = await GetLeagueForSummary(leagueId);
            if (league == null)
                return BadRequest(new { Error = "Unable to add rounds to that league" });

            var competitorA = league.Competitors.FirstOrDefault(x => x.Id == request.CompetitorA);
            var competitorB = league.Competitors.FirstOrDefault(x => x.Id == request.CompetitorB);

            if (competitorA == null || competitorB == null)
                return BadRequest(new { Error = "The competitors were not associated with the selected league" });

            ApplyInactivityRatingReduction(league);

            var bonusRating = GetCompetitorRatingBonus(league);
            var (ratingChangeA, ratingChangeB) = EloCalculator.GetRatingChange(competitorA, competitorB, request.Result);
            var effectiveRatingChangeA = ratingChangeA + bonusRating;
            var effectiveRatingChangeB = ratingChangeB + bonusRating;

            competitorA.Rating += effectiveRatingChangeA;
            competitorB.Rating += effectiveRatingChangeB;
            competitorA.UpdateWinStreak(request.Result == Result.A_WON);
            competitorB.UpdateWinStreak(request.Result == Result.B_WON);

            var round = new Round
            {
                League = league,
                Created = DateTime.Now,
                CompetitorA = request.CompetitorA,
                CompetitorB = request.CompetitorB,
                RatingChangeA = effectiveRatingChangeA,
                RatingChangeB = effectiveRatingChangeB,
                BonusRatingChange = bonusRating,
                Result = request.Result,
                Reaction = request.Reaction
            };

            await _db.AddAsync(round);
            await _db.SaveChangesAsync();

            return new CreatedResult($"/api/Leagues/{league.Id}", league.Summary());
        }

        [HttpPost("{leagueId}/UndoAddRound")]
        public async Task<IActionResult> UndoAddRound(int leagueId)
        {
            var league = await GetLeagueForSummary(leagueId);
            if (league == null)
                return BadRequest(new { Error = "You cannot edit that league" });

            var round = league.Rounds.OrderByDescending(x => x.Id).FirstOrDefault();
            if (round == null)
                return BadRequest(new { Error = "No more rounds in league to undo" });

            var competitorA = league.Competitors.FirstOrDefault(x => x.Id == round.CompetitorA);
            var competitorB = league.Competitors.FirstOrDefault(x => x.Id == round.CompetitorB);

            if (competitorA == null || competitorB == null)
                return BadRequest(new { Error = "The competitors were not associated with the last round." });

            competitorA.Rating -= round.RatingChangeA;
            competitorB.Rating -= round.RatingChangeB;

            _db.Remove(round);
            await _db.SaveChangesAsync();

            return new JsonResult(league.Summary());
        }


        private void ApplyInactivityRatingReduction(League league)
        {
            var medianRating = GetMedianRating(league);
            var inactiveCompetitors = GetInactiveCompetitors(league, minInactiveDays: 15);
            foreach (var competitor in inactiveCompetitors)
            {
                var (ratingPunishment, _) = EloCalculator.GetRatingChange(competitor.Rating, medianRating, Result.B_WON);
                var round = new Round
                {
                    League = league,
                    Created = DateTime.Now,
                    CompetitorA = competitor.Id,
                    CompetitorB = competitor.Id,
                    RatingChangeA = ratingPunishment,
                    RatingChangeB = 0,
                    Result = Result.B_WON,
                    Reaction = Reaction.INACTIVITY_PUNISHMENT,
                };
                competitor.Rating += ratingPunishment;
                _db.Add(round);
            }
        }

        ///**
        // * Removes points from inactive players and places them in the league bonus pool
        // */
        //[HttpPost("{leagueId}/PunishInactivity")]
        //public async Task<IActionResult> PunishInactivity(int leagueId) {
        //    var league = await GetLeagueForSummary(leagueId);
        //    if (league == null) {
        //        return BadRequest(new { Error = "League not found" });
        //    }

        //    var inactiveCompetitors = GetInactiveCompetitors(league, minInactiveDays: 15);

        //    if (inactiveCompetitors.Count() == 0)
        //    {
        //        return BadRequest(new { Error = "No inactive competitors" });
        //    }

        //    var medianRating = GetMedianRating(league);

        //    foreach (var competitor in inactiveCompetitors) {

        //        var (ratingPunishment, _)  = EloCalculator.GetRatingChange(competitor.Rating, medianRating, Result.B_WON);
        //        var round = new Round
        //        {
        //            League = league,
        //            Created = DateTime.Now,
        //            CompetitorA = competitor.Id,
        //            CompetitorB = competitor.Id,
        //            RatingChangeA = ratingPunishment,
        //            RatingChangeB = 0,
        //            Result = Result.B_WON,
        //            Reaction = Reaction.INACTIVITY_PUNISHMENT,
        //        };
        //        competitor.Rating += ratingPunishment;
        //        _db.Add(round);
        //    }

        //    await _db.SaveChangesAsync();
        //    return new CreatedResult($"/api/Leagues/{league.Id}", league.Summary());
        //}



        private async Task<League> GetLeagueForSummary(int leagueId)
        {
            return await _db.Leagues
                .Include(x => x.Competitors)
                .Include(x => x.Rounds)
                .FirstOrDefaultAsync(x => x.Id == leagueId);
        }

        private int GetCompetitorRatingBonus(League league)
        {
            var availableRating = 1500 * league.Competitors.Count;
            var actualRating = league.Competitors.Select(x => x.Rating).Sum();

            return Math.Min(10, availableRating - actualRating) / 2;
        }

        private IEnumerable<Competitor> GetInactiveCompetitors(League league, double minInactiveDays = 15)
        {
            var dict = new Dictionary<int, DateTime>();
            foreach (var round in league.Rounds)
            {
                if (!dict.ContainsKey(round.CompetitorA) || dict[round.CompetitorA] < round.Created)
                {
                    dict[round.CompetitorA] = round.Created;
                }
                if (!dict.ContainsKey(round.CompetitorB) || dict[round.CompetitorB] < round.Created)
                {
                    dict[round.CompetitorB] = round.Created;
                }
            }

            var now = DateTime.Now;
            return dict
                .Where(pair => (now - pair.Value).TotalDays >= minInactiveDays)
                .Select(pair => league.Competitors.First(x => x.Id == pair.Key))
                .ToList();
        }

        private int GetMedianRating(League league)
        {
            var orderedRatings = league.Competitors
                .OrderBy(x => x.Rating)
                .Select(x => x.Rating)
                .ToList();

            var size = orderedRatings.Count;
            var center = size / 2;
            if (size % 2 == 0)
            {
                return (orderedRatings[center] + orderedRatings[center - 1]) / 2;
            }
            return orderedRatings[center];
        }

        public struct CompetitorActivity
        {
            public Competitor Competitor { get; set; }
            public DateTime LastActive { get; set; }
        }

        public struct AddRoundDto
        {
            public Result Result { get; set; }
            public Reaction Reaction { get; set; }
            public int CompetitorA { get; set; }
            public int CompetitorB { get; set; }
        }
    }
}
