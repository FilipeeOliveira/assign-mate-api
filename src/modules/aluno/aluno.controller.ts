import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { AlunoResponseDto } from './dto/aluno-response.dto';
import { AlunoService } from './aluno.service';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { PaginationParams } from 'src/common/dto/pagination.dto';

@ApiTags('Alunos')
@Controller('alunos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Cadastrar novo aluno',
    description: 'Cria um novo aluno vinculado ao administrador autenticado. Valida matrícula e email únicos.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Aluno criado com sucesso',
    type: AlunoResponseDto
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflito - Matrícula ou Email já cadastrado'
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos (formato de data, email ou matrícula incorretos)'
  })
  @Post()
  create(@Req() req, @Body() createAlunoDto: CreateAlunoDto) {
    const adminId = req.user.id
    return this.alunoService.create(adminId, createAlunoDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todos alunos',
    description: 'Retorna todos alunos cadastrados pelo administrador autenticado, com paginação e ordenação.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de alunos paginada',
    type: PaginatedResponseDto
  })
  findAll(
    @Req() req,
    @Query() paginationParams: PaginationParams
  ) {
    return this.alunoService.findAll(req.user.sub, paginationParams);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar aluno por ID',
    description: 'Retorna os detalhes completos de um aluno específico. Verifica permissão do administrador.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Aluno encontrado',
    type: AlunoResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aluno não encontrado'
  })
  findOne(@Req() req, @Param('id') id: string) {
    return this.alunoService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar dados do aluno',
    description: 'Atualiza informações de um aluno existente. Mantém validação de dados únicos.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Aluno atualizado com sucesso',
    type: AlunoResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aluno não encontrado'
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Conflito - Nova matrícula ou Email já existe'
  })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateAlunoDto: UpdateAlunoDto
  ) {
    return this.alunoService.update(req.user.sub, id, updateAlunoDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover aluno',
    description: 'Exclui permanentemente um aluno do sistema. Operação irreversível.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Aluno removido com sucesso',
    type: AlunoResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Aluno não encontrado'
  })
  remove(@Req() req, @Param('id') id: string) {
    return this.alunoService.remove(req.user.sub, id);
  }
}