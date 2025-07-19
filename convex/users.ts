import { v } from 'convex/values'
import { Id } from './_generated/dataModel'
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server'

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
    if (!identity) throw new Error('User is unauthorizrd')

    const currentUser = await ctx.db.query('users')
        .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
        .first()

    if (!currentUser) throw new Error("User is not found")

    return currentUser
}

// get user by clerkId
export const getUserByClerkId = query({
    args: {
        clerkId: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users')
            .withIndex('by_clerkId', (q) => q.eq('clerkId', args.clerkId))
            .first()
        if (!user) throw new Error('User not found')
        return user
    }
})

// get current logged in user
export const getLoggedInUser = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) throw new Error('User is not authenticated')

        return currentUser
    }
})

// update user profile
export const updateUserProfile = mutation({
    args: {
        fullname: v.string(),
        bio: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)
        if (!currentUser) throw new Error('User is not authenticated')

        // update the user profile
        await ctx.db.patch(currentUser._id, {
            fullname: args.fullname,
            bio: args.bio
        })

        return true
    }
})

export const getUserProfile = query({
    args: {
        id: v.id("users")
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id)
        if (!user) throw new Error('User not found')
        return user
    }
})

export const isFollowing = query({
    args: {
        followingId: v.id("users")
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const follow = await ctx.db.query('follows')
            .withIndex('by_both', (q) => q.eq('followerId', currentUser._id).eq('followingId', args.followingId))
            .first()

        return !!follow
    }
})

export const toggleFollow = mutation({
    args: {
        followingId: v.id("users")
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx)

        const existing = await ctx.db.query('follows')
            .withIndex('by_both', (q) => q.eq('followerId', currentUser._id).eq('followingId', args.followingId))
            .first()

        if (existing) {
            // unfollow
            await ctx.db.delete(existing._id)
            // update follow stats
            await updateFollowCounts(ctx, currentUser._id, args.followingId, false)
        } else {
            // follow
            await ctx.db.insert("follows", {
                followerId: currentUser._id,
                followingId: args.followingId
            })
            // update follow stats
            await updateFollowCounts(ctx, currentUser._id, args.followingId, true)

            // push notification
            // first check if there is already a notification
            const existingNotification = await ctx.db.query('notifications')
                .withIndex('by_both', (q) => q.eq('senderId', currentUser._id).eq('receiverId', args.followingId).eq('type', 'follow'))
                .first()

            if (!existingNotification) {
                await ctx.db.insert('notifications', {
                    receiverId: args.followingId,
                    senderId: currentUser._id,
                    type: "follow"
                })
            }
        }
    }
})

async function updateFollowCounts(
    ctx: MutationCtx,
    followerId: Id<"users">,
    followingId: Id<"users">,
    isFollow: boolean
) {

    const follower = await ctx.db.get(followerId)
    const following = await ctx.db.get(followingId)

    if (follower && following) {
        //change the following count in the follower profile
        await ctx.db.patch(followerId, {
            following: follower.following + (isFollow ? 1 : -1)
        })
        // change the follower count in following profile
        await ctx.db.patch(followingId, {
            followers: following.followers + (isFollow ? 1 : -1)
        })
    }
}