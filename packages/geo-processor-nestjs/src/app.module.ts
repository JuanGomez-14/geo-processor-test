import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GeoprocessModule } from './geoprocess/geoprocess.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300,
      max: 100,
      isGlobal: true,
    }),
    GeoprocessModule,
  ],
  controllers: [],
  providers: [],
  exports: [CacheModule],
})
export class AppModule {}