import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { IceBreakerRequestDto } from './dto/ice-breaker-request.dto';
import { IceBreakerResponseDto } from './dto/ice-breaker-reponse.dto';
import { IceBreakerService } from './ice-breaker.service';

@Controller('ice-breakers')
export class IceBrakerController {
  constructor(
    private readonly iceBreakerService: IceBreakerService,
  ) {}

  @Post('generate')
  @UsePipes(new ValidationPipe())
  async generateIcebreakers(@Body() request: IceBreakerRequestDto): Promise<IceBreakerResponseDto> {
    try {
      return this.iceBreakerService.generateIcebreakers(request);
    } catch (error) {
      return {
        success: false,
        data: {
          icebreakers: [],
        },
      };
    }
  }
} 