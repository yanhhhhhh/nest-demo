import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class TestGuardGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('test guard');
    // const request = context.switchToHttp().getRequest();
    const metadata = this.reflector.get<string[]>('aaa', context.getHandler());
    console.log('aaa metadata', metadata);
    return true;
  }
}
