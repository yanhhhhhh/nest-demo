import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('rolesguard');
    // 这里的context 是 ExecutionContext 对象，执行上下文
    // context.getHandler() 获取被守卫保护的处理程序（方法）

    console.log(this.reflector.get('roles', context.getHandler()));
    // context.getClass() 获取被守卫保护的类（控制器）
    console.log(this.reflector.get('roles', context.getClass()));
    return true;
  }
}
