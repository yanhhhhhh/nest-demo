import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query',
    },
  ],
});
async function test1() {
  await prisma.user.create({
    data: {
      name: '1111',
      email: '1111@example.com',
    },
  });
  await prisma.user.create({
    data: {
      name: '2222',
      email: '2222@example.com',
    },
  });
  const users = await prisma.user.findMany();
  console.log(users);
}

// test1();

async function test2() {
  const user = await prisma.user.create({
    data: {
      name: 'zhouyh',
      email: 'zhouyh@example.com',
      posts: {
        create: [
          {
            title: 'aaa',
            content: 'aaa',
          },
          {
            title: 'bbb',
            content: 'bbbb',
          },
        ],
      },
    },
  });
  console.log(user);
}
test2();
