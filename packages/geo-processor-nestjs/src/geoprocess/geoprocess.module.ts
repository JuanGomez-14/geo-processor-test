import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeoprocessController } from './geoprocess.controller';

@Module({
  imports: [HttpModule], 
  controllers: [GeoprocessController],
})
export class GeoprocessModule {}