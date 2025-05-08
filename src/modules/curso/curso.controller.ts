import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CursoService } from './curso.service';
import { CursoResponseDto } from './dto/curso-response.dto';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { PaginationParams } from 'src/common/dto/pagination.dto';

@ApiTags('Cursos')
@Controller('cursos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo curso', description: 'Cria um novo curso vinculado ao administrador autenticado' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso', type: CursoResponseDto })
  @ApiResponse({ status: 409, description: 'Código do curso já existe' })
  create(@Req() req, @Body() createCursoDto: CreateCursoDto) {
    const adminId = req.user.id
    return this.cursoService.create(adminId, createCursoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar todos cursos', 
    description: 'Retorna todos cursos do administrador autenticado' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de cursos', 
    type: [CursoResponseDto] 
  })
  findAll(@Req() req, @Query() paginationParams: PaginationParams) {
    return this.cursoService.findAll(req.user.sub, paginationParams);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar curso por ID', description: 'Retorna detalhes de um curso específico' })
  @ApiResponse({ status: 200, description: 'Curso encontrado', type: CursoResponseDto })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.cursoService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar curso', description: 'Atualiza informações de um curso existente' })
  @ApiResponse({ status: 200, description: 'Curso atualizado', type: CursoResponseDto })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  @ApiResponse({ status: 409, description: 'Novo código já está em uso' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateCursoDto: UpdateCursoDto
  ) {
    return this.cursoService.update(req.user.sub, id, updateCursoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir curso', description: 'Remove permanentemente um curso' })
  @ApiResponse({ status: 200, description: 'Curso excluído', type: CursoResponseDto })
  @ApiResponse({ status: 404, description: 'Curso não encontrado' })
  remove(@Req() req, @Param('id') id: string) {
    return this.cursoService.remove(req.user.sub, id);
  }
}