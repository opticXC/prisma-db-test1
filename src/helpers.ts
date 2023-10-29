import {
    Lawyer,
    Query,
    QueryStatus,
    ResponseCodes,
    Result,
    User,
    prisma,
} from "./commons";
import { password_hash } from "./crypt";

export async function getUser(username: string): Promise<Result<User>> {
    const data = await prisma.user.findUnique({
        where: {
            username: username,
        },
        include: {
            queries: true,
            lawyer: true,
        },
    });
    return { responseCode: ResponseCodes.OK, data };
}

export async function createUser(
    username: string,
    email: string,
    pass: string,
): Promise<Result<User>> {
    const check = await prisma.user.findUnique({
        where: { username: username },
    });
    if (check != null) {
        return { responseCode: ResponseCodes.CONFLICT, data: null };
    }
    const data = await prisma.user.create({
        data: {
            username: username,
            email: email,
        },
    });
    const ps = await prisma.pass.create({
        data: {
            userId: data.id,
            data: password_hash(pass),
        },
    });
    return { responseCode: ResponseCodes.OK, data: data };
}

export async function deleteAccount(id: string): Promise<ResponseCodes> {
    const check = await prisma.user.findUnique({
        where: {
            id: id,
        },
        include: {
            queries: true,
            lawyer: true,
        },
    });
    if (check == null) {
        return ResponseCodes.NOTFOUND;
    } else {
        if (check.lawyer != null) {
            await prisma.query.updateMany({
                where: {
                    lawyerId: check.id,
                },
                data: {
                    status: QueryStatus.Orphaned,
                },
            });
            await prisma.lawyer.delete({
                where: {
                    userId: id,
                },
            });
        }
        await prisma.query.updateMany({
            where: { userId: id },
            data: { status: QueryStatus.Orphaned },
        });

        await prisma.user.delete({
            where: {
                id: id,
            },
        });
    }
    return ResponseCodes.OK;
}

export async function checkPass(
    id: string,
    pass: string,
): Promise<ResponseCodes> {
    const check = await prisma.pass.findUnique({
        where: {
            userId: id,
        },
    });
    if (check == null) return ResponseCodes.NOTFOUND;
    else if (password_hash(pass) == check.data) return ResponseCodes.OK;
    else return ResponseCodes.UNAUTHORISED;
}

export async function updatePass(
    id: string,
    pass: string,
): Promise<ResponseCodes> {
    const ps = await prisma.pass.findUnique({
        where: {
            userId: id,
        },
    });
    if (ps == null) {
        return ResponseCodes.NOTFOUND;
    } else {
        await prisma.pass.update({
            where: {
                userId: ps.userId,
            },
            data: {
                data: password_hash(pass),
            },
        });

        return ResponseCodes.OK;
    }
}

export async function registerLawyer(
    id: string,
    firstName: string,
    lastName: string,
    services: string[],
): Promise<Result<Lawyer>> {
    const check = await prisma.lawyer.findUnique({
        where: {
            userId: id,
        },
    });
    if (check != null)
        return { responseCode: ResponseCodes.CONFLICT, data: null };

    const lyr = await prisma.lawyer.create({
        data: {
            userId: id,
            firstName: firstName,
            lastName: lastName,
            services: services,
        },
        include: {
            queries: true,
        },
    });
    return { responseCode: ResponseCodes.OK, data: lyr };
}

export async function getLawyer(username: string): Promise<Result<Lawyer>> {
    const check = await getUser(username);
    if (check.data == null) {
        return { responseCode: ResponseCodes.NOTFOUND, data: null };
    }
    const lyr = await prisma.lawyer.findUnique({
        where: {
            userId: check.data.id,
        },
        include: {
            user: true,
            queries: true,
        },
    });

    return { responseCode: ResponseCodes.OK, data: lyr };
}

export async function createQuery(
    userId: string,
    lawyerId: string,
    context: string,
): Promise<Result<Query>> {
    const check = await prisma.query.findMany({
        where: {
            userId: userId,
            lawyerId: lawyerId,
        },
    });

    if (check.length > 0) {
        return { responseCode: ResponseCodes.FORBIDDEN, data: null };
    } else {
        const qry = await prisma.query.create({
            data: {
                userId: userId,
                lawyerId: lawyerId,
                context: context,
            },
        });

        return { responseCode: ResponseCodes.OK, data: qry };
    }
}

export async function getQuery(id: number): Promise<Result<Query>> {
    const check = await prisma.query.findUnique({
        where: {
            id: id,
        },
        include: {
            user: true,
            lawyer: true,
        },
    });

    if (check == null) {
        return { responseCode: ResponseCodes.NOTFOUND, data: null };
    } else {
        return { responseCode: ResponseCodes.OK, data: check };
    }
}

export async function updateQuery(
    id: number,
    status: QueryStatus,
): Promise<Result<Query>> {
    const check = await prisma.query.findUnique({
        where: {
            id: id,
        },
    });
    if (check == null) {
        return { responseCode: ResponseCodes.NOTFOUND, data: null };
    } else {
        const n_qry = await prisma.query.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });
        return { responseCode: ResponseCodes.OK, data: n_qry };
    }
}
