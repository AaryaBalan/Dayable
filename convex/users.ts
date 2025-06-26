import { v } from 'convex/values'
import { mutation, MutationCtx, QueryCtx } from './_generated/server'

export const createUser = mutation({
    args: {
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.string(),
        clerkId: v.string()
    },
    handler: async (ctx, args) => {

        // checks for existing user
        const existingUser = await ctx.db.query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .first()

        if (existingUser) return
        
        // user in db
        await ctx.db.insert('users', {
            username: args.username,
            fullname: args.fullname,
            email: args.email,
            bio: args.bio,
            image: args.image,
            clerkId: args.clerkId,
            followers: 0,
            following: 0,
            posts: 0
        })
    }
})

// to get the authenticated user
export const getAuthenticatedUser = async (ctx: QueryCtx | MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity()
    if(!identity) throw new Error('User is unauthorizrd')
        
    const currentUser = await ctx.db.query('users')
    .withIndex('by_clerkId', (q)=>q.eq('clerkId', identity.subject))
    .first()

    if(!currentUser) throw new Error("User is not found")

    return currentUser
}