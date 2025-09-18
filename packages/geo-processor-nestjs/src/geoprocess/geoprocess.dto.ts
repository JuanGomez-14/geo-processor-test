// src/geoprocess/geoprocess.dto.ts
import { IsArray, IsNumber, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class PointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class PointsListDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PointDto)
  points: PointDto[];
}