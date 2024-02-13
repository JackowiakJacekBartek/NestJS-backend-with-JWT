import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Player } from './interfaces/player.interface';
import { CreatePlayerDto } from './DTO/createPlayerDto';

@Controller('player')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('random')
  getRandomPlayer(): Player {
    return this.appService.getRandomPlayer();
  }

  @Get('all')
  getAllPlayers(@Req() request: Request): Player[] {
    return this.appService.getAllPlayers();
  }

  @Get(':id')
  getPlayerById(@Param() params: any): Player {
    return this.appService.getPlayerById(params.id);
  }

  @Post()
  createPlayer(@Body() createPlayerDto: CreatePlayerDto): Player {
    return this.appService.addPlayer(createPlayerDto);
  }

  //PUT daje od nowa dane. Jak dam tylko name i surname to age się usunie.
  @Put(':id')
  putPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param() params: any,
  ): Player {
    return this.appService.putPlayer(params.id, createPlayerDto);
  }

  //PATCH modyfikuje tylko te pola, które mu damy, jak dam tylko name i surname to age zostanie.
  @Patch(':id')
  patchPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param() params: any,
  ): Player {
    return this.appService.patchPlayer(params.id, createPlayerDto);
  }

  @Delete(':id')
  deletePlayer(@Param() params: any): Player[] {
    return this.appService.deletePlayer(params.id);
  }
}
