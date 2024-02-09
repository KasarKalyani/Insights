import { analyze } from "@/utils/ai"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const PATCH = async(request: Request, {params}) => {

    const {content} = await request.json()

    const user = await getUserByClerkID()

    const updatedEntry = await prisma.journalEntry.update({
        where:{
            userId: user.id,
            id: params.id
        },
        data: {
            content
        },
        include:{
            analysis: true
        }
    })

    const analysis = await analyze(updatedEntry.content);
    const up=await prisma.analysis.upsert({
        where:{
            entryId: updatedEntry.id,
        },
        create:{
            entryId: updatedEntry.id,
            ...analysis
        },
        update: analysis
    })

    return NextResponse.json({data: {...updatedEntry, analysis: up}})

}