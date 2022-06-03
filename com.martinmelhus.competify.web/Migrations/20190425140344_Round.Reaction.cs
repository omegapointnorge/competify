using Microsoft.EntityFrameworkCore.Migrations;

namespace com.martinmelhus.competify.web.Migrations
{
    public partial class RoundReaction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Reaction",
                table: "Rounds",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Reaction",
                table: "Rounds");
        }
    }
}
