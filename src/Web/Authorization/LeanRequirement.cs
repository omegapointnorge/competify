using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Authorization
{
    public class LeanRequirement : IAuthorizationRequirement
    {
    }

    public class LeanAuthorizationHandler : AuthorizationHandler<LeanRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, LeanRequirement requirement)
        {
            if (context.Resource is AuthorizationFilterContext mvcContext) {
                if (mvcContext.HttpContext.Request.Headers.TryGetValue("X-AUTHENTICATION-TOKEN", out var authenticationToken))
                {
                    if (authenticationToken.ToString() == Constants.AuthenticationToken)
                    {
                        context.Succeed(requirement);
                    }
                }
            }
            
            return Task.CompletedTask;
        }
    }
}
