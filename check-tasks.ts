import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const tasks = await prisma.task.findMany()
    console.log('Total tasks:', tasks.length)
    tasks.forEach(t => {
        console.log(`- ${t.title}: completed=${t.completed}, completedAt=${t.completedAt}, createdAt=${t.createdAt}`)
    })

    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    console.log('Now:', now.toISOString())
    console.log('Today boundary:', today.toISOString())

    process.exit(0)
}

main()
