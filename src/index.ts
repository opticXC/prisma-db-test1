import { port, public_url, prisma, ResponseCodes } from "./commons";
import {
    checkPass,
    createQuery,
    createUser,
    deleteAccount,
    getLawyer,
    getQuery,
    getUser,
    registerLawyer,
    updatePass,
    updateQuery,
} from "./helpers";

import express from "express";

import cors from "cors";

const app = express();

app.use(
    cors({
        origin: [`${public_url}`],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    }),
);

app.use(express.json());

app.get("/", (req, res) => {
    res.sendStatus(ResponseCodes.OK);
});

app.get("/user/:username", async (req, res) => {
    const { username } = req.params;
    const result = await getUser(username);
    if (result == null) {
        return res.sendStatus(404);
    }
    res.json(result);
});

app.post("/user", async (req, res) => {
    const { username, email, pass } = req.body;
    const result = await createUser(username, email, pass);

    if (result.data != null) {
        return res.json(result.data);
    }
    return res.sendStatus(result.responseCode);
});

app.delete("/user", async (req, res) => {
    const { id } = req.body;
    const result = await deleteAccount(id);
    return res.sendStatus(result);
});

app.put("/pass", async (req, res) => {
    const { id, pass } = req.body;
    const result = await updatePass(id, pass);
    return res.sendStatus(result);
});

app.get("/pass", async (req, res) => {
    const { id, pass } = req.body;
    const result = await checkPass(id, pass);

    return res.sendStatus(result);
});

app.get("/lawyer/:username", async (req, res) => {
    const { username } = req.params;
    const result = await getLawyer(username);
    if (result.data == null) {
        return res.sendStatus(result.responseCode);
    } else {
        return res.json(result.data);
    }
});

app.post("/lawyer", async (req, res) => {
    const { id, firstName, lastName, services } = req.body;
    const result = await registerLawyer(id, firstName, lastName, services);
    if (result.data == null) {
        return res.sendStatus(result.responseCode);
    } else {
        return res.json(result.data);
    }
});

app.post("/query", async (req, res) => {
    const { userId, lawyerId, context } = req.body;
    const result = await createQuery(userId, lawyerId, context);
    if (result.data == null) {
        return res.sendStatus(result.responseCode);
    } else {
        return res.json(result.data);
    }
});

app.put("/query", async (req, res) => {
    const { id, status } = req.body;
    const result = await updateQuery(+id, status);
    if (result.data == null) {
        return res.sendStatus(result.responseCode);
    } else {
        return res.json(result.data);
    }
});

app.get("/query/:id", async (req, res) => {
    const { id } = req.params;

    // the post + basically converts the string to a number. i dont understand javascript
    const result = await getQuery(+id);
    if (result.data == null) {
        return res.sendStatus(result.responseCode);
    } else {
        return res.json(result.data);
    }
});

app.listen(port, () => {
    console.log(`hosting at ${public_url}:${port}`);
});
