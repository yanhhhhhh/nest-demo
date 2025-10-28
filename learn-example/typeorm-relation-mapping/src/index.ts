import { AppDataSource } from './data-source';
import { IdCard } from './entity/IdCard';
import { User } from './entity/User';

AppDataSource.initialize()
  .then(async () => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.firstName = 'zhou2222';
    user.lastName = 'yh';
    user.age = 25;
    user.id = 1; // 设置主键，表示这是一个更新操作

    console.log('Inserting a new ID card for the user...');
    const idCard = new IdCard();
    idCard.id = 1; // 设置主键，表示这是一个更新操作
    idCard.cardNumber = '222222';
    idCard.user = user;

    // await AppDataSource.manager.save(user);
    await AppDataSource.manager.save(idCard); // cascade: true, 由于在 IdCard 实体中启用了级联操作，保存身份证时会自动保存关联的用户实体
    // await AppDataSource.manager.delete(User, 1); // 测试 onDelete: 'CASCADE'
    const u = await AppDataSource.manager.find(User, {
      relations: {
        idCard: true,
      },
    });
    console.log(u);
    const ics = await AppDataSource.manager.find(IdCard, {
      relations: {
        user: true,
      },
    });
    console.log(ics);
  })
  .catch((error) => console.log(error));
