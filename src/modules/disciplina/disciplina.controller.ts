import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { DisciplinaResponseDto } from './dto/disciplina-response.dto';
import { DisciplinaService } from './disciplina.service';
import { PaginationParams } from 'src/common/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@ApiTags('Disciplinas')
@Controller('disciplinas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DisciplinaController {
  constructor(private readonly disciplinaService: DisciplinaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova disciplina', description: 'Vincula a um curso existente' })
  @ApiResponse({ status: 201, description: 'Disciplina criada', type: DisciplinaResponseDto })
  create(@Req() req, @Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.disciplinaService.create(req.user.id, createDisciplinaDto);
  }

  @Get()

  @ApiOperation({ summary: 'Listar todas as disciplinas',
    description: 'Retorna todas as disciplinas do administrador autenticado'
   })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de disciplinas',
    type: [DisciplinaResponseDto]
  })
  findAll(@Req() req, @Query() paginationParams: PaginationParams) {
    return this.disciplinaService.findAll(req.user.sub, paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar disciplina por ID' })
  @ApiResponse({ status: 200, description: 'Disciplina encontrada', type: DisciplinaResponseDto })
  findOne(@Req() req, @Param('id') id: string) {
    return this.disciplinaService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar disciplina' })
  @ApiResponse({ status: 200, description: 'Disciplina atualizada', type: DisciplinaResponseDto })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDisciplinaDto: UpdateDisciplinaDto
  ) {
    return this.disciplinaService.update(req.user.sub, id, updateDisciplinaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir disciplina' })
  @ApiResponse({ status: 200, description: 'Disciplina excluída', type: DisciplinaResponseDto })
  remove(@Req() req, @Param('id') id: string) {
    return this.disciplinaService.remove(req.user.sub, id);
  }
}