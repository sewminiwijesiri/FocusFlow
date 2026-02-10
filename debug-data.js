require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users:', users.map(u => ({ id: u.id, email: u.email })));
    
    for (const user of users) {
      const stats = await prisma.task.groupBy({
        by: ['completed'],
        where: { userId: user.id },
        _count: true
      });
      console.log(`User ${user.email} task stats:`, stats);
      
      const tasks = await prisma.task.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });
      tasks.forEach(t => {
        console.log(`- [${t.completed ? 'X' : ' '}] ${t.title} | Created: ${t.createdAt.toISOString()} | CompletedAt: ${t.completedAt ? t.completedAt.toISOString() : 'null'}`);
      });
    }
    
    // Check durations
    const focusToday = await prisma.timeEntry.aggregate({
        _sum: { duration: true },
        where: { start: { gte: new Date(new Date().setHours(0,0,0,0)) } }
    });
    console.log('Total focus today (seconds):', focusToday._sum.duration);

  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
