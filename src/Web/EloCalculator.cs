using Data;
using System;

namespace Web
{
    public static class EloCalculator
    {
        public static (int ratingChangeA, int ratingChangeB) GetRatingChange(int ratingA, int ratingB, Result result)
        {
            var scoreA = result == Result.A_WON ? 1 : result == Result.DRAW ? 0.5 : 0;
            var scoreB = result == Result.B_WON ? 1 : result == Result.DRAW ? 0.5 : 0;

            return (
                RatingChange(ratingA, ratingB, scoreA),
                RatingChange(ratingB, ratingA, scoreB));
        }

        public static (int ratingChangeA, int ratingChangeB) GetRatingChange(Competitor a, Competitor b, Result result) {

            return GetRatingChange(a.Rating, b.Rating, result);
        }
        
        private static int RatingChange(int rating, int opponentRating, double score) {
            var expectedScore = ExpectedScore(rating, opponentRating);
            var k = KFactor(rating, opponentRating);
            return (int)(k * (score - expectedScore));
        }

        private static double ExpectedScore(int rA, int rB) {
            var qA = Math.Pow(10, rA / 400.0);
            var qB = Math.Pow(10, rB / 400.0);
            return qA / (qA + qB);
        }
        
        private static int KFactor(int rA, int rB) {
            var r = Math.Min(rA, rB);
            if (r >= 2400) return 16;
            else if (r >= 2100) return 24;
            return 32;
        }
    }
}
