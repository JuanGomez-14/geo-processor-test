"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoprocessController = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const axios_1 = require("@nestjs/axios");
const geoprocess_dto_1 = require("./geoprocess.dto");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let GeoprocessController = class GeoprocessController {
    httpService;
    constructor(httpService) {
        this.httpService = httpService;
    }
    async processPoints(pointsListDto) {
        const pythonServiceUrl = 'http://127.0.0.1:8000/process';
        try {
            const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(pythonServiceUrl, pointsListDto).pipe((0, operators_1.map)(res => res.data), (0, operators_1.catchError)(error => {
                if (error.response) {
                    throw new common_1.HttpException(error.response.data, error.response.status);
                }
                throw new common_1.HttpException('Python service is unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            })));
            return response;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.GeoprocessController = GeoprocessController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geoprocess_dto_1.PointsListDto]),
    __metadata("design:returntype", Promise)
], GeoprocessController.prototype, "processPoints", null);
exports.GeoprocessController = GeoprocessController = __decorate([
    (0, common_1.Controller)('process'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GeoprocessController);
//# sourceMappingURL=geoprocess.controller.js.map