// prevent api and http use by anyonw, only authenticated user can senc the request and save the data and handle it
// svix is used to handle webhooks

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import {Webhook} from 'svix'
import {api} from './_generated/api'

const http = httpRouter();

http.route({ 
    path: "/clerk-webhook", //this endpoint is need to be same as the clerk webhook endpoint
    method: "POST",
    handler: httpAction(async (ctx, request) => {

        // check if the clerk webhook secret key is present
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) { 
            throw new Error("Missing CLERK_WEBHOOK_SECRET env variable");
        }

        // check headers 
        const svix_id = request.headers.get('svix-id');
        const svix_signature = request.headers.get('svix-signature');
        const svix_timestamp = request.headers.get('svix-timestamp');
        
        // throw error when any one of the above is undefined
        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response('Missing svix headers', {
                status: 400
            });
        }

        // if everything works well get the payload and assign it to body as json stringify
        const payload = await request.json();
        const body = JSON.stringify(payload);

        // create new webhook
        const wh = new Webhook(webhookSecret);
        let evt: any;

        //verify webhooks and assign it to evt
        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-signature': svix_signature,
                'svix-timestamp': svix_timestamp
            }) as any
        } catch (error) {
            console.log('error while verifying webhooks', error)
            return new Response('Error occured', {status: 400})
        }

        // create user 
        const eventType = evt.type
        if(eventType === "user.created") {
            const { id, email_addresses, first_name, last_name, image_url } = evt.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();
            try {
                await ctx.runMutation(api.users.createUser, {
                    email,
                    fullname: name,
                    image: image_url,
                    clerkId: id,
                    username: email.split('@')[0]
                })
            } catch (error) {
                console.log('Error creating user', error)
                return new Response('Error creating user', {status: 500})
            }
        }

        return new Response('Webhook processed successfully', {status: 200})
            
    }) 
});

export default http