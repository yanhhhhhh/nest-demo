"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nestjs_i18n_1 = require("nestjs-i18n");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new nestjs_i18n_1.I18nValidationPipe());
    app.useGlobalFilters(new nestjs_i18n_1.I18nValidationExceptionFilter({
        detailedErrors: false,
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map