import { AppDataSource } from './data-source';
import { User } from './entity/User';

AppDataSource.initialize()
  .then(async () => {
    // console.log("Inserting a new user into the database...")
    // const user = new User()
    // user.firstName = "Timber"
    // user.lastName = "Saw"
    // user.age = 25
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    // console.log("Loading users from the database...")
    // const users = await AppDataSource.manager.find(User)
    // console.log("Loaded users: ", users)

    // console.log("Here you can setup and run express / fastify / any other framework.")
    // 1. save 方法会先查询一次数据库，确认数据是否存在，存在则执行更新操作，不存在则执行插入操作
    // await AppDataSource.manager.save(User, [
    //   { firstName: 'ccc', lastName: 'ccc', age: 21 },
    //   { firstName: 'ddd', lastName: 'ddd', age: 22 },
    //   { firstName: 'eee', lastName: 'eee', age: 23 },
    // ]);
    // 2. 删除和批量删除使用
    // await AppDataSource.manager.delete(User, { firstName: 'ccc' });
    // await AppDataSource.manager.delete(User, [1, 3]);
    // sql 查询
    const queryBuider = AppDataSource.manager.createQueryBuilder();
    const users = await queryBuider
      .select('user')
      .from(User, 'user')
      .where('user.age = :age', { age: 22 })
      .getMany();
    console.log(users);
  })
  .catch((error) => console.log(error));
