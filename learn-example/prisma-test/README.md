# prisma

## create Project

1. init

```
   mkdir prisma-test
   cd prisma-test
   npm init -y
```

2. install typescript package
   ```bash
   npm install typescript ts-node @types/node --save-dev
   ```
   init typescript
   ```
   npx tsc --init
   ```
3. install prisma

   ```bash
   npm install prisma --save-dev
   ```

4. initialize prisma with mysql

```
npx prisma init --datasource-provider mysql
```

![alt text](image.png)
项目目录下多了 schema 文件和 env 文件

5.  修改 .env 文件

- mysql workbench 创建数据库 prisma_test
  ![alt text](image-1.png)
- 修改 .env 文件 中的用户名、密码、数据库名等信息

```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/prisma_test"
```

6. 定义model
   在 schema.prisma 文件中定义数据模型：

```prisma


model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int
}
```

@id 是主键
@default(autoincrement()) 指定默认值是自增的数值
@unique 表示该字段值唯一
? 表示该字段可选
@relation 是指多对一的关联关系，通过authorId 关联User表的id字段

7. 生成和运行迁移

```
npx prisma migrate dev --name aaa
```

![alt text](image-2.png)

- 此时会生成并执行建表sql文件，在 `prisma/migrations` 目录下可以看到生成的迁移文件
  ![alt text](image-3.png)

- 在 mysql workbench 里可以看到生成了 2 个表：
  ![alt text](image-4.png)
  ![alt text](image-5.png)

8. 用 @prisma/client 来做 CRUD
   ```ts src/index.ts
   import { PrismaClient } from '@prisma/client';
   const prisma = new PrismaClient();
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
   test1();
   ```
   npx ts-node ./src/index.ts
   ![alt text](image-6.png)

## 问题

1. Prisma 版本兼容性问题：Prisma 7.x 存在 ESM 模块兼容性问题
   解决方案：降级到稳定的 Prisma 5.22.0 版本

2. Schema 配置缺失：

- generator 中的 provider 应该是 "prisma-client-js" 而不是 "prisma-client"
- datasource 缺少 url 配置，需要添加 url = env("DATABASE_URL")

```

```
