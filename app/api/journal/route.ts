import { analyze } from "@/utils/ai";
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export const POST = async()=>{
    const user = await getUserByClerkID();
    const entry = await prisma.journalEntry.create({
        data:{
            userId: user.id,
            content: "write about your day!"
        }
    })

    const analysis = await analyze(entry.content)
    await prisma.analysis.create({
        data:{
            entryId: entry.id,
            ...analysis,
        }
    })

    return NextResponse.json({ data: entry })
}