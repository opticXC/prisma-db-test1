import {QueryStatus, prisma} from "./commons.js";
import { password_hash } from "./crypt.js";


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
            data: password_hash(pass)
        }
    });


    res.appendHeader("Content-Type", "application/json");
    res.json(data);
}

export async function deleteAccount(req:any, res:any) {
    const {id} = req.body;
    const check = await prisma.user.findUnique({
        where:{
            id:id,
        },
        include:{
            queries:true,
            lawyer:true,
        }
    })
    if (check  == null){
        return res.sendStatus(404);
    }else{
        if (check.lawyer != null){
            await prisma.query.updateMany({
                where:{
                    lawyerId:check.id
                },
                data:{
                    status: QueryStatus.Orphaned,
                }
            });
            await prisma.lawyer.delete({
                where:{
                    userId:id,
                }
            })

        };
        
        await prisma.query.updateMany({
            where:{userId:id},
            data: {status:QueryStatus.Orphaned}
        });

        await prisma.user.delete({
            where:{
                id:id
            }
        });

    }

}



export async function checkPass(req:any, res:any){
    const {id, pass} = req.body;
    const check = await prisma.pass.findUnique({
        where:{
            userId: id,
        }
    });
    if (check == null) return res.sendStatus(404);

    else if (password_hash(pass) == check.data) return res.sendStatus(200);
    
    else return res.sendStatus(404);
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


export async function getQuery(req:any, res:any) {
    const {id} = req.params;
    const check = await prisma.query.findUnique({
        where:{
            id:id,
        },
        include:{
            user:true,
            lawyer:true,
        }
    });

    if (check == null){
        return res.sendStatus(404);
    }else{
        return res.json(check);
    }
}

export async function updateQuery(req:any, res:any){
    const {id, status} = req.body;
    const qry = await prisma.query.findUnique({
        where:{
            id:id
        }
    });
    if (qry == null){
        return res.sendStatus(404);
    }else{
        prisma.query.update({
            where:{
                id:id
            },
            data:{
                status:status
            }
        })
    }
}