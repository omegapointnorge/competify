using Microsoft.EntityFrameworkCore.Migrations;

namespace Web.Migrations
{
    public partial class BonusRatingChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BonusRatingChange",
                table: "Rounds",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BonusRatingChange",
                table: "Rounds");
        }
    }
}
