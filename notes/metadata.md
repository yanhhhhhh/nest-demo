# reflect-metadata

## 核心概念

### 什么是元数据？

- 在Typescript 类型信息只存在编译期，编辑成js之后就没有了
- reflect-metadata 的作用——把类型信息保存到运行时，让程序可以在执行时获取类型或者自定义数据

## 核心作用

- reflect-metadata 提供了一组API，可以在运行时为类、属性、方法等添加和读取元数据
- 常用API
  - Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey?)：为目标对象或其属性定义元数据
  - Reflect.getMetadata(metadataKey, target, propertyKey?)：获取目标对象或其属性的元数据
  - Reflect.hasMetadata(metadataKey, target, propertyKey?)：检查目标对象或其属性是否存在指定的元数据
  - Reflect.deleteMetadata(metadataKey, target, propertyKey?)：删除目标对象或其属性的指定元数据

## 案例1

> 在nest中使用reflect-metadata读取构造函数参数类型

1. 创建 nest g resource metadata
2. 在metadata.controller.ts 中
   ```ts
   import { MetadataService } from './metadata.service';
   import { Controller, Get } from '@nestjs/common';
   import 'reflect-metadata'; //导入'reflect-metadata'
   @Controller('/metadata')
   export class MetadataController {
     constructor(private readonly metadataService: MetadataService) {}
     @Get()
     getOne() {
       this.metadataService.getdata();
       //读取构造函数参数类型,输出结果: [ [Class: MetadataService] ]
       console.log(
         Reflect.getMetadata('design:paramtypes', MetadataController),
       );
       return 'metadata';
     }
   }
   ```
3. 运行 nest start，访问 http://localhost:3000/metadata ，查看控制台输出结果
   ```ts
   [ [class MetadataService] ]
   ```

## 案例2

> 自定义元数据
> 在nest中使用reflect-metadata为类和方法添加自定义元数据，并读取这些元数据

1. 在metadata.controller.ts 中

   ```ts
   import { MetadataService } from './metadata.service';
   import { Controller, Get } from '@nestjs/common';
   import 'reflect-metadata'; //导入'reflect-metadata'

   //为类添加自定义元数据
   Reflect.defineMetadata('role', 'admin', MetadataController);

   @Controller('/metadata')
   export class MetadataController {
     constructor(private readonly metadataService: MetadataService) {}

     //为方法添加自定义元数据
     @Get()
     getOne() {
       this.metadataService.getdata();

       //读取类的自定义元数据
       const role = Reflect.getMetadata('role', MetadataController);
       console.log(`Class role metadata: ${role}`); // 输出: Class role metadata: admin

       //为方法添加自定义元数据
       Reflect.defineMetadata('methodMeta', 'getMethod', this.getOne);
       const methodMeta = Reflect.getMetadata('methodMeta', this.getOne);
       console.log(`Method metadata: ${methodMeta}`); // 输出: Method metadata: getMethod

       return 'metadata';
     }
   }
   ```

## 案例3

> 路由守卫中使用reflect-metadata实现基于角色的访问控制
> 在NestJS中使用reflect-metadata为路由处理程序添加角色元数据，并在守卫中读取这些元数据以实现基于角色的访问控制。

1. 创建一个自定义装饰器，用于为路由处理程序添加角色元数据

```ts metadata.controller.ts
import { MetadataService } from './metadata.service';
import { MetadataService } from './metadata.service';
import {
  Controller,
  Get,
  SetMetadata,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import 'reflect-metadata';
import { RolesGuard } from './roles.guard';
import { RolesInterceptor } from './roles.interceptor';

@SetMetadata('roles', ['user']) //// 类级别
@Controller('/metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}
  @Get()
  @UseGuards(RolesGuard) // 使用自定义守卫
  @UseInterceptors(RolesInterceptor) // 使用自定义拦截器
  @SetMetadata('roles', ['admin']) // 方法级别
  getOne() {
    this.metadataService.getdata();
    //读取构造函数参数类型,输出结果: [ [Class: MetadataService] ]
    console.log(Reflect.getMetadata('design:paramtypes', MetadataController));
    return 'metadata';
  }
}}
}
```

2. 创建一个自定义守卫，用于检查用户角色
   - 通过 Reflector 获取路由处理程序的角色元数据

```ts roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  // 依赖注入 Reflector
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('RolesGuard canActivate called');
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(`Required roles: ${roles}`);
    return true; // 这里简化为总是允许访问
  }
}
```

3. 创建一个自定义拦截器，用于记录访问日志
   - 属性注入方式使用 Reflector 获取路由处理程序的角色元数据

```ts roles.interceptor.ts
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
    //     Reflector 中方法的区别:
    // [ 'admin' ]
    // [ 'user' ]
    // [ [ 'admin' ], [ 'user' ] ]
    // [ 'admin', 'user' ]
    // [ 'admin' ]
    return next.handle();
  }
}
```

4. reflector.get vs reflector.getAll vs reflector.getAllAndMerge vs reflector.getAllAndOverride
   - reflector.get: 只获取指定目标（类或方法）的元数据
   - reflector.getAll: 获取多个目标的元数据，返回一个数组，包含所有目标的元数据
   - reflector.getAllAndMerge: 获取多个目标的元数据，并将它们合并成一个数组返回
   - reflector.getAllAndOverride: 获取多个目标的元数据，按顺序查找第一个存在的元数据并返回

# NestJS 模块元数据机制详解

## 🧩 一、`@Module()` 的位置

`@Module()` 装饰器定义在：

```
@nestjs/common/decorators/modules/module.decorator.ts
```

源码片段（Nest v10+）如下 👇

```ts
import { MODULE_METADATA } from '../../constants';
import 'reflect-metadata';

export interface ModuleMetadata {
  imports?: any[];
  controllers?: any[];
  providers?: any[];
  exports?: any[];
}

export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    for (const property in metadata) {
      if (metadata[property]) {
        Reflect.defineMetadata(
          MODULE_METADATA[property],
          metadata[property],
          target,
        );
      }
    }
  };
}
```

---

## ⚙️ 二、源码逻辑解析

这段代码其实非常精炼，可以拆解为：

1. **`Module()` 返回一个类装饰器**；
2. 当你使用 `@Module({...})` 时，Nest 会：

   - 遍历你传入的配置对象；
   - 调用 `Reflect.defineMetadata()`；
   - 把这些配置以键值形式挂载到目标类（`target`）上。

---

# 🧱 三、举个具体例子

比如我们有一个典型的模块：

```ts
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

当这段代码执行后，`@Module()` 装饰器会在类 `UsersModule` 上执行以下操作：

```ts
Reflect.defineMetadata('controllers', [UsersController], UsersModule);
Reflect.defineMetadata('providers', [UsersService], UsersModule);
```

也就是说：

> Nest 把所有模块相关的配置信息，**都以元数据的形式存在类定义上（静态）**。

---

# 🔍 四、Nest 后续如何读取这些元数据？

当 Nest 启动应用（执行 `NestFactory.create()`）时，底层的 **`DependenciesScanner`** 和 **`ModuleCompiler`** 会扫描所有模块：

在源码中（`@nestjs/core/scanner.ts`）：

```ts
const metadata = Reflect.getMetadataKeys(module);
```

以及：

```ts
const controllers = Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, module);
const providers = Reflect.getMetadata(MODULE_METADATA.PROVIDERS, module);
const imports = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module);
const exports = Reflect.getMetadata(MODULE_METADATA.EXPORTS, module);
```

这一步就读取了前面 `@Module()` 定义时保存的所有数据。

随后，这些信息会被用于：

- 构建依赖注入容器（DI Container）
- 注册控制器、服务、导出模块
- 建立模块之间的依赖图（Module Graph）

---

# 🧠 五、核心常量 `MODULE_METADATA`

在 Nest 源码中定义于：

```ts
// @nestjs/common/constants.ts

export const MODULE_METADATA = {
  IMPORTS: 'imports',
  PROVIDERS: 'providers',
  CONTROLLERS: 'controllers',
  EXPORTS: 'exports',
};
```

这些常量只是方便管理字符串 key，让框架能一致性地存取元数据。

---

# 🔩 六、总结：NestJS 的 metadata 使用流程

| 阶段       | 操作                                                    | 调用的 reflect-metadata 方法 |
| ---------- | ------------------------------------------------------- | ---------------------------- |
| 模块定义时 | `@Module({...})` 把 imports、controllers 等写入类元数据 | `Reflect.defineMetadata()`   |
| 启动时扫描 | 框架读取模块定义中的元数据                              | `Reflect.getMetadata()`      |
| 构建依赖树 | 基于元数据创建 ModuleRef、依赖图                        | ——                           |
| 运行时解析 | 在运行期通过 Reflector 或 context 读取元信息            | `Reflect.getMetadata()`      |

---

# 📦 七、完整执行链简化图

```
@Module() 装饰器
     ↓
Reflect.defineMetadata()
     ↓
模块类上保存 imports/controllers/providers/exports 信息
     ↓
NestFactory.create()
     ↓
DependenciesScanner 读取 Reflect.getMetadata()
     ↓
创建 ModuleContainer
     ↓
注入依赖、注册控制器、导出模块
```

---

# ✅ 八、简化复现示例（还原 Nest 模块机制）

```ts
import 'reflect-metadata';

const MODULE_METADATA = {
  IMPORTS: 'imports',
  CONTROLLERS: 'controllers',
  PROVIDERS: 'providers',
  EXPORTS: 'exports',
};

function Module(metadata: Record<string, any>): ClassDecorator {
  return (target: Function) => {
    for (const key in metadata) {
      Reflect.defineMetadata(
        MODULE_METADATA[key.toUpperCase()],
        metadata[key],
        target,
      );
    }
  };
}

class ServiceA {}
class ControllerA {}

@Module({
  controllers: [ControllerA],
  providers: [ServiceA],
})
class AppModule {}

// 框架启动时读取
console.log(
  'controllers:',
  Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, AppModule),
);
console.log(
  'providers:',
  Reflect.getMetadata(MODULE_METADATA.PROVIDERS, AppModule),
);
```

输出结果：

```
controllers: [ [class ControllerA] ]
providers: [ [class ServiceA] ]
```

这正是 NestJS 的模块元数据系统的核心机制。

---

✅ **总结一句话：**

> `@Module()` 通过 `Reflect.defineMetadata()` 把模块结构（imports、controllers、providers、exports）存储到类上，Nest 启动时再用 `Reflect.getMetadata()` 扫描这些信息，从而实现模块依赖注入与自动装配。

---

是否希望我接着帮你展示一下 Nest 是如何在 **`DependenciesScanner`** 里通过这些元数据递归扫描依赖模块并构建 DI 容器的？那部分是理解 NestJS 启动机制的关键。
