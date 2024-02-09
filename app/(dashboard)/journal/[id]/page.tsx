import Editor from "@/components/Editor";
import { prisma } from "@/utils/db";


const getEntry = async(id)=>{
    const entry = await prisma.journalEntry.findUnique({
        where:{
            id
        },
        include:{
            analysis: true
        }
    })

    return entry
}

const EntryPage =async({params})=>{
    const entry = await getEntry(params.id)
    
    return(<>
    <div className="h-full w-full">
      <Editor entry={entry}/>
    </div>
    </>)
}

export default EntryPage;