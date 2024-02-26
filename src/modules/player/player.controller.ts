import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Redirect,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { CreatePlayerDto } from 'src/common/dto/createPlayerDto';
import { Player } from 'src/common/interfaces/player.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('players')
@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  //Jeśli w thunder client ustawimy w parametrach version na 5 to zostanie zwrócona 2 strona.
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  //Domyślna wartość dla parametru
  @Get('default')
  async findAll(
    @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe)
    activeOnly: boolean,
    @Query('page', new DefaultValuePipe(3), ParseIntPipe) page: number,
  ) {
    return { activeOnly, page };
  }

  @Get('random')
  getRandomPlayer(): Player {
    return this.playerService.getRandomPlayer();
  }

  @Get('all')
  getAllPlayers(@Req() request: Request): Player[] {
    return this.playerService.getAllPlayers();
  }

  //Walidacja parametru: id musi być int
  @Get(':id')
  getPlayerById(@Param('id', ParseIntPipe) id: number): Player {
    return this.playerService.getPlayerById(id);
  }

  //Walidacja body po klasie CreatePlayerDto
  @Post()
  createPlayer(
    @Body(new ValidationPipe()) createPlayerDto: CreatePlayerDto,
  ): Player {
    return this.playerService.addPlayer(createPlayerDto);
  }

  //PUT daje od nowa dane. Jak dam tylko name i surname to age się usunie.
  @Put(':id')
  putPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param() params: any,
  ): Player {
    return this.playerService.putPlayer(params.id, createPlayerDto);
  }

  //PATCH modyfikuje tylko te pola, które mu damy, jak dam tylko name i surname to age zostanie.
  @Patch(':id')
  patchPlayer(
    @Body() createPlayerDto: CreatePlayerDto,
    @Param() params: any,
  ): Player {
    return this.playerService.patchPlayer(params.id, createPlayerDto);
  }

  @Delete(':id')
  deletePlayer(@Param() params: any): Player[] {
    return this.playerService.deletePlayer(params.id);
  }
}
