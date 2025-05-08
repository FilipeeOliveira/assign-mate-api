import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { TurmaResponseDto } from './dto/turma-response.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { PaginationParams } from 'src/common/dto/pagination.dto';

@ApiTags('Turmas')
@Controller('turmas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova turma', description: 'Vincula a um curso existente' })
  @ApiResponse({ status: 201, description: 'Turma criada', type: TurmaResponseDto })
  create(@Req() req, @Body() createTurmaDto: CreateTurmaDto) {
    return this.turmaService.create(req.user.id, createTurmaDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar turmas', 
    description: 'Lista todas turmas do administrador' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de turmas', 
    type: [TurmaResponseDto] 
  })
  findAll(@Req() req,  @Query() paginationParams: PaginationParams) {
    return this.turmaService.findAll(req.user.sub, paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhes da turma', description: 'Buscar turma por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da turma', type: TurmaResponseDto })
  findOne(@Req() req, @Param('id') id: string) {
    return this.turmaService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar turma', description: 'Atualiza informações da turma' })
  @ApiResponse({ status: 200, description: 'Turma atualizada', type: TurmaResponseDto })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateTurmaDto: UpdateTurmaDto
  ) {
    return this.turmaService.update(req.user.sub, id, updateTurmaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir turma', description: 'Remove permanentemente uma turma' })
  @ApiResponse({ status: 200, description: 'Turma excluída', type: TurmaResponseDto })
  remove(@Req() req, @Param('id') id: string) {
    return this.turmaService.remove(req.user.sub, id);
  }
}