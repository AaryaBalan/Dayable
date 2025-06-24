import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
    handler: async(ctx) => {
        const identity = ctx.auth.getUserIdentity()
        if(!identity) throw new Error('User is unauthorizrd')
        return await ctx.storage.generateUploadUrl();
    }
})

export const createPost = mutation({
    args: {
        caption: v.optional(v.string()),
        storageId: v.id('_storage')
    },

    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity) throw new Error('User is unauthorizrd')
            
        const currentUser = await ctx.db.query('users')
        .withIndex('by_clerkId', (q)=>q.eq('clerkId', identity.subject))
        .first()

        if(!currentUser) throw new Error("User is not found")

        // generate image url
        const image = await ctx.storage.getUrl(args.storageId)
        if(!image) throw new Error('Image file is missing')

        // insert the post in to the database
        const post = await ctx.db.insert('posts', {
            userId: currentUser._id,
            image,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0
        })

        // now update the count of the post by 1 for the respective user
        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1
        })

        return post
    }
})