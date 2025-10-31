import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesInterceptor implements NestInterceptor {
  @Inject(Reflector)
  private reflector: Reflector;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('RolesInterceptor intercept called');
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    console.log(roles);
    const classRoles = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    console.log(classRoles);

    console.log('Reflector 中方法的区别:');
    const handle = context.getHandler();
    const cls = context.getClass();
    console.log(this.reflector.get<string[]>('roles', handle));
    console.log(this.reflector.get<string[]>('roles', cls));
    console.log(this.reflector.getAll('roles', [handle, cls]));
    console.log(
      this.reflector.getAllAndMerge<string[]>('roles', [handle, cls]),
    );
    console.log(
      this.reflector.getAllAndOverride<string[]>('roles', [handle, cls]),
    );
    return next.handle();
  }
}
