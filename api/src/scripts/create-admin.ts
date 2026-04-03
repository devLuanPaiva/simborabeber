import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { UserService } from '../resources/user/user.service'

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule)
    const userService = app.get(UserService)

    const [, , name, email, password] = process.argv

    if (!name || !email || !password) {
        console.error('❌ Uso: ts-node create-admin.ts <name> <email> <password>')
        process.exit(1)
    }

    try {
        const admin = await userService.createAdminUser(name, email, password)
        console.log('✅ Admin criado:', admin)
    } catch (error: unknown) {
        console.error('❌ Erro:', (error as Error).message)
    } finally {
        await app.close()
    }
}

bootstrap()