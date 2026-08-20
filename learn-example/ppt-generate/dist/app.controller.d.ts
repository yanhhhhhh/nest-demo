import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getUniversityData(): import("./types/university").University[] | import("rxjs").Observable<Record<string, any>>;
}
