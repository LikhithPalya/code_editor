import { httpRouter } from "convex/server";
import {httpAction} from "./_generated/server"
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import {api} from "./_generated/api"
const http = httpRouter()

http.route({
    path:"/clerk-webhook",
    method:"POST",

    handler: httpAction(async(context,request)=>{
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
        if(!webhookSecret){
            throw new Error("Missing CLERK_WEBHOOKSECRET environment variable")
        }
        const svix_id = request.headers.get("svix-id")
        const svix_timestamp = request.headers.get("svix-timestamp")
        const svix_signature = request.headers.get("svix-signature")
        if(!svix_id || !svix_timestamp || !svix_signature){
            throw new Error("Missing svix headers")
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(webhookSecret)
        let evt:WebhookEvent
        try{
            evt = wh.verify(body,{
                "svix-id":svix_id,
                "svix-timestamp":svix_timestamp,
                "svix-signature":svix_signature,
            }) as WebhookEvent
        }catch(e){
            console.log("Error verifying webhook: ",e);
            return new Response("error",{
                status:400
            })            
        }
        
        const eventType = evt.type;

        if(eventType === "user.created"){
            //SAVING DATA TO CONVEX DATABASE
            const {id,email_addresses, first_name, last_name} = evt.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name} ${last_name}`;
            try {
                await context.runMutation(api.users.syncUser,{userId:id,email,name});
            } catch (error) {
                return new Response("error updating user data to convex db" + error,{
                    status:400
                })
            }
        }
        return new Response("Webhook processed successfully", {status:200});   

    })
})

export default http
