import { AppDataSource } from './data-source';
import { Article } from './entity/Article';
import { Tag } from './entity/Tag';

AppDataSource.initialize()
  .then(async () => {
    const a1 = new Article();
    a1.id = 1;
    a1.title = 'aaaa';
    a1.content = 'aaaa content';
    const a2: Article = new Article();
    a2.id = 2;
    a2.title = 'bbbb';
    a2.content = 'bbbb content';
    const t1 = new Tag();
    t1.id = 1;
    t1.name = 'tag1';
    const t2 = new Tag();
    t2.id = 2;
    t2.name = 'tag2';
    const t3 = new Tag();
    t3.id = 3;
    t3.name = 'tag3';
    a1.tags = [t1, t2];
    a2.tags = [t1, t2, t3];
    await AppDataSource.manager.save([t1, t2, t3]);
    await AppDataSource.manager.save([a1, a2]);
    const articleFindBuider = AppDataSource.manager.createQueryBuilder(
      Article,
      'article',
    );
    const articles = await articleFindBuider
      .leftJoinAndSelect('article.tags', 'tag')
      .getMany();
    console.log(articles);
    console.log(articles.map((article) => article.tags));
    const articles2 = await AppDataSource.manager.find(Article, {
      relations: {
        tags: true,
      },
    });
    console.log(articles2);
    console.log(articles2.map((article) => article.tags));
    const article2 = await AppDataSource.manager.findOne(Article, {
      where: {
        id: 2,
      },
      relations: {
        tags: true,
      },
    });
    console.log('-----articel2', article2);
    article2.title = 'new title 2';
    article2.tags = article2.tags.filter((tag) => tag.name === 'tag2');
    //更新aricle2 的title
    await AppDataSource.manager.save(article2);
    console.log('-------new articel2', article2);

    // 删除,置了 CASCADE 的级联删除，这样只要你删除了 article 或者 tag，它都会跟着删除关联记
    // await AppDataSource.manager.delete(Article, 1);
    // await AppDataSource.manager.delete(Tag, 2);

    const tags = await AppDataSource.manager.find(Tag, {
      relations: {
        articles: true,
      },
    });
    console.log(tags);
    console.log(tags.map((tag) => tag.articles));
  })
  .catch((error) => console.log(error));
