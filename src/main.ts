import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const port = 3001;
    app.use(cookieParser());
    await app.listen(port);

    Logger.log(`App running on port ${port}`);
}
bootstrap();
