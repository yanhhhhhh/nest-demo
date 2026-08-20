"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_1 = __importDefault(require("puppeteer"));
const rxjs_1 = require("rxjs");
const pptxgen = require('pptxgenjs');
let cache = null;
const url = 'https://www.icourse163.org/university/view/all.htm';
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    getUniversityData() {
        if (cache) {
            return cache;
        }
        async function getData(observer) {
            const browser = await puppeteer_1.default.launch({
                headless: true,
                executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                defaultViewport: {
                    width: 0,
                    height: 0,
                },
            });
            const page = await browser.newPage();
            await page.goto(url);
            await page.waitForSelector('.u-usitys');
            const universityList = await page.$eval('.u-usitys', (el) => {
                return [...el.querySelectorAll('.u-usity')].flatMap((item) => {
                    const image = item.querySelector('img');
                    if (!image) {
                        return [];
                    }
                    else {
                        return [
                            {
                                name: image.alt,
                                img: image.src,
                                link: item.getAttribute('href'),
                            },
                        ];
                    }
                });
            });
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
        return new rxjs_1.Observable((observer) => {
            getData(observer).catch((err) => {
                observer.error(err);
            });
        });
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map