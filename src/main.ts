import { NestFactory } from '@nestjs/core';
import { newEnforcer } from 'casbin';
import { join } from 'path';

import { AppModule } from './app.module';
import { authz } from './auth/authz';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(authz(async () => {
    const enforcer = await newEnforcer(join(__dirname, 'examples/rbac_model.conf'), join(__dirname, 'examples/rbac_policy.csv'));
    return enforcer;
  }));
  await app.listen(3000);
}
bootstrap();
