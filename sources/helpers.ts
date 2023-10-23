import {prisma} from "./commons";
import { password_hash } from "./crypt";


export async function getUser(req:any,res:any) {
    const {username} = req.params;
    const data = await prisma.user.findUnique({
        where:{
            username:username
        },
        include:{
            queries:true,
            lawyer:true,
        }
    })
    if (data==null){
        res.appendHeader("Content-Type", "application/json");
        return res.sendStatus(404).json({body:"User not found"})
    }else{
        res.appendHeader("Content-Type", "application/json");
        return res.json(data);
    }
}

export async function createUser(req:any,res:any){
    const { username, email, pass } = req.body;

    const check = await prisma.user.findUnique({where:{username:username}})
    if (check != null){
        return res.sendStatus(409);
    }
    const data = await prisma.user.create({
        data:{
            username: username,
            email: email,
        }
    })

    const ps = await prisma.pass.create({
        data: {
            userId: data.id,
            data: pass
        }
    });


    res.appendHeader("Content-Type", "application/json");
    res.json(data);
}

export async function updatePass(req:any,res:any){
    const {id, pass} = req.body;
    const ps = await prisma.pass.findUnique({
        where:{
            userId:id
        }
    });
    if (ps == null){
        return res.sendStatus(404);
    }else{
        await prisma.pass.update({
            where:{
                userId: ps.userId,
            },
            data: {
                data: password_hash(pass)
            }
        })

        res.sendStatus(200);
    }
}


export async function registerLawyer(req:any,res:any){
    const {id, firstName, lastName, services} = req.body;
    const lyr = await prisma.lawyer.create({
        data:{
            userId:id,
            firstName: firstName,
            lastName: lastName,
            services: services
        },
        include:{
            queries:true,
        }
    })

    return res.json(lyr);
}

export async function createQuery(req:any,res:any){
    const {userId, lawyerId, context} = req.body;

    const check = await prisma.query.findMany({
        where:{
            userId:userId,
            lawyerId:lawyerId
        }
    })

    if (check.length > 0){
        return res.sendStatus(409)
    }else{
        const qry = await prisma.query.create({
            data:{
                userId:userId,
                lawyerId:lawyerId,
                context:context
            }
        })

        return res.json(qry);
    }
}