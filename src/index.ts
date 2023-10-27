import {port,public_url,prisma} from './commons.js'
import { checkPass, createQuery, createUser, deleteAccount, getQuery, getUser, registerLawyer, updatePass } from './helpers.js'

import express from 'express'

import cors from 'cors'


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

app.get("/user/:username", getUser);
app.post("/user", createUser);
app.delete("/user", deleteAccount);

app.put("/pass", updatePass);
app.get("/pass", checkPass);


//app.get("/lawyer/:username" getLawyer);
app.post("/lawyer", registerLawyer);


app.post("/query", createQuery);
//app.put("/query" updateQuery);
app.get("/query/:id", getQuery);


app.listen(port, () => {
    console.log(`hosting at ${public_url}:${port}`);
})
