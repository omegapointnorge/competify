using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web.Migrations
{
    public partial class DuplicateForAnotherSeason : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string sql = @"
                DBCC CHECKIDENT ('dbo.Leagues', RESEED, 1)
                DECLARE @newLeagueId TABLE (newLeagueId INT);
                INSERT INTO dbo.Leagues (Name, Passphrase)
                OUTPUT inserted.Id INTO @newLeagueId
                VALUES ('2023', 'Lean');

                INSERT INTO dbo.Competitors (Name, Rating, LeagueId, WinStreak)
                SELECT Name, 1500, newLeagueId, 0
                FROM dbo.Competitors, @newLeagueId
                WHERE LeagueId = 1;";
            migrationBuilder.Sql(sql);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            string sql = @"
                BEGIN TRAN
                DELETE FROM dbo.Leagues WHERE Name = '2023';
                DELETE FROM dbo.Competitors WHERE LeagueId = (SELECT Id FROM dbo.Leagues WHERE Name = '2023');
                COMMIT;";
            migrationBuilder.Sql(sql);
        }
    }
}
