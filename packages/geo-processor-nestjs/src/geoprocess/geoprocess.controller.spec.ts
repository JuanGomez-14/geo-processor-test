import { Test, TestingModule } from '@nestjs/testing';
import { GeoprocessController } from './geoprocess.controller';

describe('GeoprocessController', () => {
  let controller: GeoprocessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoprocessController],
    }).compile();

    controller = module.get<GeoprocessController>(GeoprocessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
