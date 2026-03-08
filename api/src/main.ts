import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { HttpExceptionFilter } from "./filters/http-exception.filter"
import { ResponseInterceptor } from "./interceptors/response.interceptor"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		allowedHeaders: "*",
	})

	app.useGlobalInterceptors(new ResponseInterceptor())
	app.useGlobalFilters(new HttpExceptionFilter())
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	)
	const config = new DocumentBuilder()
		.setTitle("Cardápio API")
		.setDescription("API para gerenciamento do cardápio")
		.setVersion("1.0")
		.build()

	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("api", app, document)

	await app.listen(process.env.PORT ?? 3001)
}
bootstrap()