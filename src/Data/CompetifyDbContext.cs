using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Data
{
    public class CompetifyDbContext : DbContext
    {
        public CompetifyDbContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<League> Leagues { get; set; }
        public DbSet<Competitor> Competitors { get; set; }
        public DbSet<Round> Rounds { get; set; }
    }
}
