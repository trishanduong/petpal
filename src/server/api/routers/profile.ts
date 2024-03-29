import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import getUserId from "~/server/helpers/getUserId";

export const profileRouter = createTRPCRouter({
  //Create a new profile (sign up)
  create: privateProcedure
    .input(z.object({
      name: z.string().min(1),
      age:z.number(),
      bio:z.string().max(255),
      sex: z.string(),
      profilePic: z.string(),
      location: z.string(),
    }))
    .mutation(async ({ctx, input})=>{
      const {name, sex, age, bio, profilePic, location} = input;
      
      const userId = await getUserId();
      
      if(typeof userId !== "string") throw new TRPCError({
        code:"UNAUTHORIZED",
        message: "No user"
      });

      const profile = await ctx.db.dogProfile.create({
        data: {
         name,
         age,
         bio,
         sex,
         profilePic,
         city: location,
         userId,
        }
      });
      
      return profile;
    }),
  //Update or change the profile pic
  updateProfilePic: privateProcedure
    .input(z.object({
      profilePic: z.string(),
    }))
    .mutation(async({ctx, input})=>{
      const {profilePic} = input;
      const userId = await getUserId();
      
      if(typeof userId !== "string") throw new TRPCError({
        code:"UNAUTHORIZED",
        message: "No user"
      });


      const profile = await ctx.db.dogProfile.update({
        where: {
          userId,
        },
        data: {
          profilePic},
      })

      return profile;
    }),
    
  updateProfile: privateProcedure
    .input(z.object({
      name: z.string(), 
      age: z.number(), 
      profilePic:z.string(),
      bio: z.string().max(255), 
      sex: z.string(),  
      location: z.string(),
      userId: z.string(),
    }))
    .mutation(async({ctx, input})=>{
      if(typeof input.age === 'string') Number(input.age);
      
      const profile = await ctx.db.dogProfile.update({
        where: {
          userId: input.userId,
        },
        data: {
          name: input.name,
          age: input.age,
          bio: input.bio,
          sex: input.sex,
          city: input.location,
          profilePic:input.profilePic,
        },
      })
   
      return profile;
    }),

  //Get dog profile using userId
  getProfileById: privateProcedure
    .input(z.object({
      type: z.string().optional(),
      userId: z.string().optional(),
    }))
    .query(async({ctx, input})=>{
      console.log('query', input.userId);

      if(input.type="personal") {
        const userId = await getUserId();
        const profile = await ctx.db.dogProfile.findUnique({
          where: {
            userId,
          }
        })
        return profile;
      } else {
          const profile = await ctx.db.dogProfile.findUnique({
            where: {
              userId: input.userId,
            }
          })
          return profile;
      }
    }),

    //generate random profile
    getRandomProfile: publicProcedure
    .input(z.object({
      excludeUserId: z.string(),
    }))
    .query(async({ctx, input})=>{
      const totalUsers = await ctx.db.dogProfile.count({
        where: {
          userId: {
            not: input.excludeUserId,
          }
        }
      });
      //console.log('totalUsers', totalUsers);
      const randomIndex = Math.floor(Math.random() * totalUsers);
      const randomUser = await ctx.db.dogProfile.findMany({
        take: 1,
        skip: randomIndex,
        where: {
          userId: {
            not: input.excludeUserId
          }
        }
      });
      console.log('user', randomUser);
      return randomUser[0];
    }),
});