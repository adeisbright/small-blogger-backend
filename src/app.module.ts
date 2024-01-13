import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(
      config.database.uri , 
      config.database.connectionName
    ),
    FeaturesModule , 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
