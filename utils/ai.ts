import {OpenAI} from '@langchain/openai';
import {StructuredOutputParser} from "langchain/output_parsers"
import {PromptTemplate} from 'langchain/prompts'
import { Document } from 'langchain/document';
import { loadQARefineChain } from 'langchain/chains';
import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import z from "zod"


const parser = StructuredOutputParser.fromZodSchema(
    z.object(
        {
            mood: z.string().describe('the mood of person who wrote the journal entry'),
            summary: z.string().describe('quick summary of entire entry'),
            negative: z.string().describe('is journalentry negative? does it contains negative emotions?'),
            color: z.string().describe('a hexadecimal color code to represent emaotions. (i.e, #0101fe represent blur fot happiness)')
        }
    )
)

const getPrompt = async(content)=>{
    const format_instructions = parser.getFormatInstructions()

    const prompt = new PromptTemplate({
        template:'analyze following journal entry. follow the instructions and format your response to match instructions given, no matter what! \n{format_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: {format_instructions},
    })

    const input = await prompt.format({
        entry: content
    })

    console.log(input)
    return input
}

export const analyze = async (content) =>{
    const input = await getPrompt(content)
    const model = new OpenAI({tempreture:0, modelName: 'gpt-3.5-turbo'})
    const result = await model.call(input)

    try{
        return parser.parse(result)
    }
    catch(e){
        console.log(e)
    }
}

export const qa =async(question,entries)=>{
    const docs = entries.map(entry=>{
        return new Document({
            pageContent : entry.content,
            metadata: {id: entry.id, createdAt: entry.createdAt}
        })
    })

    const model = new OpenAI({temperature:0, modelName: 'gpt-3.5-turbo'})
    const chain = loadQARefineChain(model)
    const embeddings = new OpenAIEmbeddings()
    const store = await MemoryVectorStore.fromDocuments(docs,embeddings)
    const relavantDocs = await store.similaritySearch(question)
    const res=await chain._call({
        input_documents: relavantDocs,
        question
    })

    return res.output_text
}