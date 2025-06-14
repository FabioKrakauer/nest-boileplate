import { INestApplication } from '@nestjs/common';
import { User } from '../../modules/auth/entities/User.entity';

export async function setupAdminJs(app: INestApplication) {
    const adminjs = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    const AdminJSTypeorm = await import('@adminjs/typeorm');

    adminjs.AdminJS.registerAdapter({
        Resource: AdminJSTypeorm.Resource,
        Database: AdminJSTypeorm.Database,
    });

    const componentLoader = new adminjs.ComponentLoader();

    const admin = new adminjs.AdminJS({
        rootPath: '/admin',
        componentLoader,
        resources: [
            {
                resource: User,
                options: {}
            }
        ],
    });

    const adminRouter = AdminJSExpress.buildRouter(admin)

    app.use(admin.options.rootPath, adminRouter);

    console.log("here!")
    if (process.env.APP_ENV === 'development') {
        admin.watch();
    } else {
        console.log("AdminJS is running in production mode");
        admin.initialize();
    }
}