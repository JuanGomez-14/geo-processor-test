import { HttpService } from '@nestjs/axios';
import { PointsListDto } from './geoprocess.dto';
export declare class GeoprocessController {
    private readonly httpService;
    constructor(httpService: HttpService);
    processPoints(pointsListDto: PointsListDto): Promise<any>;
}
