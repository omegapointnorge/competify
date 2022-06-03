using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class RoundIncludesRatingChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RatingChangeA",
                table: "Rounds",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RatingChangeB",
                table: "Rounds",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RatingChangeA",
                table: "Rounds");

            migrationBuilder.DropColumn(
                name: "RatingChangeB",
                table: "Rounds");
        }
    }
}
