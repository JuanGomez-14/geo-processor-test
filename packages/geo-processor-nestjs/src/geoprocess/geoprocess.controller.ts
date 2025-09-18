import { Controller, Post, Body, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';import { HttpService } from '@nestjs/axios';
import { PointsListDto } from './geoprocess.dto';
import { lastValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Controller('process')
@UseInterceptors(CacheInterceptor)
export class GeoprocessController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async processPoints(@Body() pointsListDto: PointsListDto) {
    const pythonServiceUrl = 'http://127.0.0.1:8000/process';

    try {
      const response = await lastValueFrom(
        this.httpService.post(pythonServiceUrl, pointsListDto).pipe(
          map(res => res.data),
          catchError(error => {
            if (error.response) {
              throw new HttpException(error.response.data, error.response.status);
            }
            throw new HttpException('Python service is unavailable', HttpStatus.SERVICE_UNAVAILABLE);
          })
        )
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}