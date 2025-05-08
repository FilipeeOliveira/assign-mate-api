import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { CreateCursoDto } from './dto/create-curso.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationParams } from 'src/common/dto/pagination.dto';


@Injectable()
export class CursoService {
  constructor(private prisma: PrismaService) {}

  async create(adminId: string, createCursoDto: CreateCursoDto) {
    await this.checkUniqueCodigo(createCursoDto.codigo);
    
    return this.prisma.curso.create({
      data: {
        ...createCursoDto,
        adminId: adminId
      }
    });
  }

  async findAll(adminId: string, paginationParams: PaginationParams) {
    const { page = 1, perPage = 15, sort = 'createdAt', sortDir = 'desc' } = paginationParams;
  
    const [total, data] = await this.prisma.$transaction([
      this.prisma.curso.count({
        where: { adminId },
      }),
      this.prisma.curso.findMany({
        where: { adminId },
        orderBy: sort ? { [sort]: sortDir } : undefined,
        skip: (page - 1) * perPage,
        take: perPage,
        include:{
         Disciplina: true,
        }
      }),
    ]);
  
    const totalPages = Math.ceil(total / perPage);
  
    return {
      total,
      totalPages,
      currentPage: page,
      perPage,
      data,
    };
  }

  async findOne(adminId: string, id: string) {
    const curso = await this.prisma.curso.findUnique({
      where: { id, adminId }
    });

    if (!curso) {
      throw new NotFoundException('Curso não encontrado');
    }
    return curso;
  }

  async update(adminId: string, id: string, updateCursoDto: UpdateCursoDto) {
    await this.findOne(adminId, id);
    
    if (updateCursoDto.codigo) {
      await this.checkUniqueCodigo(updateCursoDto.codigo, id);
    }

    return this.prisma.curso.update({
      where: { id },
      data: updateCursoDto
    });
  }

  async remove(adminId: string, id: string) {
    await this.findOne(adminId, id);
    return this.prisma.curso.delete({ where: { id } });
  }

  private async checkUniqueCodigo(codigo: string, excludeId?: string) {
    const existingCurso = await this.prisma.curso.findFirst({
      where: { 
        codigo,
        NOT: { id: excludeId } 
      }
    });

    if (existingCurso) {
      throw new ConflictException('Código do curso já está em uso');
    }
  }
}