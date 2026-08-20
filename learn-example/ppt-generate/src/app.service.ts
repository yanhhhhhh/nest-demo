import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import type { University } from './types/university';
import { Observable, Subscriber } from 'rxjs';
const pptxgen = require('pptxgenjs');

let cache: University[] | null = null;

const url = 'https://www.icourse163.org/university/view/all.htm';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getUniversityData() {
    if (cache) {
      return cache;
    }
    async function getData(observer: Subscriber<Record<string, any>>) {
      const browser = await puppeteer.launch({
        headless: true, // headless模式，设置为true表示不显示浏览器界面
        executablePath:
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        defaultViewport: {
          width: 0,
          height: 0,
        },
      });
      const page = await browser.newPage();
      await page.goto(url);
      await page.waitForSelector('.u-usitys');

      const universityList: University[] = await page.$eval(
        '.u-usitys',
        (el) => {
          return [...el.querySelectorAll('.u-usity')].flatMap((item) => {
            const image = item.querySelector<HTMLImageElement>('img');
            if (!image) {
              return [];
            } else {
              return [
                {
                  name: image.alt,
                  img: image.src,
                  link: item.getAttribute('href'),
                },
              ];
            }
          });
        },
      );
      const ppt = new pptxgen();
      console.log('ppt', ppt);
      const list = universityList.slice(0, 50);
      for (const university of list) {
        await page.goto('https://www.icourse163.org' + (university.link || ''));
        await page.waitForSelector('.m-cnt');
        const content = await page.evaluate(() => {
          const p = document.querySelector('.m-cnt p');
          return p?.textContent?.trim() || '暂无描述';
        });

        university.des = content;
        observer.next({
          data: university,
        });
        const slide = ppt.addSlide();

        slide.addText(university.name, {
          x: '10%',
          y: '10%',
          color: '#ff0000',
          fontSize: 30,
          align: ppt.AlignH.center,
        });

        slide.addImage({
          path: university.img,
          x: '42%',
          y: '25%',
        });

        slide.addText(university.des, {
          x: '10%',
          y: '60%',
          color: '#000000',
          fontSize: 14,
        });
      }
      await browser.close();
      await ppt.writeFile({
        fileName: '中国所有大学.pptx',
      });
      cache = universityList;
    }

    return new Observable<Record<string, any>>((observer) => {
      getData(observer).catch((err) => {
        observer.error(err);
      });
    });
  }
}
