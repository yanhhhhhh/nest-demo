import type { University } from './types/university';
import { Observable } from 'rxjs';
export declare class AppService {
    getHello(): string;
    getUniversityData(): University[] | Observable<Record<string, any>>;
}
