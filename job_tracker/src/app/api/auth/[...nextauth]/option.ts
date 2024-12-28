import type { NextAuthOptions } from "next-auth";
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const options: NextAuthOptions={
    providers:[
        //set up github autho login 
        GitHubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret:process.env.GITHUB_SECRET as string,
        }),
        //set up autho log in for user email and password
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                username:{
                    label:"Username:",
                    type: "text",
                    placeholder:"username"
                },
                password:{
                    label:"Password:",
                    type:"password"
                }
            },
            async authorize(credentials){
                //database user names and password retrive from here
                //ref https://next-auth.js.org/configuration/providers/credentials
                //place holder
                const user1 = {id:"42", name:"Dave", password:"nextauth"}
                if(credentials?.username === user1.name && credentials?.password===user1.password){
                    return user1
                }
                else{
                    return null
                }
            }
        })
    ],
} 