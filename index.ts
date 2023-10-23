import {port,public_url,prisma} from './sources/commons'
import { createQuery, createUser, getUser, registerLawyer, updatePass } from './sources/helpers'

import express from 'express'

import cors from 'cors'



import {cyrb53, password_hash} from "./sources/crypt";


const app = express();



app.use(cors({
    origin:[`${public_url}`],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
}));

app.use(express.json());

app.get("/", (req,res)=>{
    res.sendStatus(200).json({body: "Online"});
})

app.get("/user/:username", async(req,res)=> getUser)

app.post("/user", async(req, res)=>createUser)


app.put("/pass", async(req,res)=>updatePass)


app.get("/lawyer/:username")
app.post("/lawyer", async(req,res)=>registerLawyer)


app.post("/query", async(req,res)=>createQuery)
app.put("/query");


app.listen(port, () => {
    console.log(`hosting at ${public_url}:${port}`);
})
