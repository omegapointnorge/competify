using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Data
{
    public class Round : Entity
    {
        public int CompetitorA { get; set; } 
        public int CompetitorB { get; set; }
        public int RatingChangeA { get; set; }
        public int RatingChangeB { get; set; }        
        public int BonusRatingChange { get; set; }


        public int LeagueId { get; set; }
        public League League { get; set; }

        public Result Result { get; set; }
        public Reaction Reaction { get; set; }
        public DateTime Created { get; set; }
    }

    public enum Result
    {
        A_WON = 0,
        DRAW = 1,
        B_WON = 2,
    }

    public enum Reaction 
    {
        NONE = 0,
        A_DOMINATED = 1,
        B_DOMINATED = 2,
        INACTIVITY_PUNISHMENT = 3,
    }

    public static class RoundEx {
        public static RoundSummary Summary(this Round round) {
            return new RoundSummary
            {
                CompetitorA = round.CompetitorA,
                CompetitorB = round.CompetitorB,
                RatingChangeA = round.RatingChangeA,
                RatingChangeB = round.RatingChangeB,
                BonusRatingChange = round.BonusRatingChange,
                Result = round.Result,
                Reaction = round.Reaction,
                Created = round.Created.ToUniversalTime()
            };
        }
    }

    public class RoundSummary
    {
        public int CompetitorA { get; set; }
        public int CompetitorB { get; set; }
        public int RatingChangeA { get; set; }
        public int RatingChangeB { get; set; }
        public int BonusRatingChange { get; set; }
        public Result Result { get; set; }
        public Reaction Reaction { get; set; }
        public DateTime Created { get; set; }
    }
}
