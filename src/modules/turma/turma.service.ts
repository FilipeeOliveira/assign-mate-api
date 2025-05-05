import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { Turno, Modalidade } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginationParams } from 'src/common/dto/pagination.dto';

@Injectable()
export class TurmaService {
  constructor(private prisma: PrismaService) {}

  async create(adminId: string, createTurmaDto: CreateTurmaDto) {
    await this.validateRelations(createTurmaDto, adminId);
    
    return this.prisma.turma.create({
      data: {
        codigo: createTurmaDto.codigo,
        semestre: createTurmaDto.semestre,
        turno: createTurmaDto.turno as Turno,
        modalidade: createTurmaDto.modalidade as Modalidade,
        curso: {
          connect: { id: createTurmaDto.cursoId }
        },
        admin: {
          connect: { id: adminId }
        }
      }
    });
  }

  async findAll(adminId: string, paginationParams: PaginationParams) {
    const { page = 1, perPage = 15, sort = 'createdAt', sortDir = 'desc' } = paginationParams;
  
    const [total, data] = await this.prisma.$transaction([
      this.prisma.turma.count({
        where: { adminId },
      }),
      this.prisma.turma.findMany({
        where: { adminId },
        orderBy: sort ? { [sort]: sortDir } : undefined,
        skip: (page - 1) * perPage,
        take: perPage,
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
    const turma = await this.prisma.turma.findUnique({
      where: { id, adminId },
      include: { curso: true }
    });

    if (!turma) {
      throw new NotFoundException('Turma não encontrada');
    }
    return turma;
  }

  async update(adminId: string, id: string, updateTurmaDto: UpdateTurmaDto) {
    await this.findOne(adminId, id);
    await this.validateRelations(updateTurmaDto, adminId, id);

    const data: any = {
      ...updateTurmaDto,
      turno: updateTurmaDto.turno as Turno,
      modalidade: updateTurmaDto.modalidade as Modalidade,
    };

    if (updateTurmaDto.cursoId) {
      data.curso = { connect: { id: updateTurmaDto.cursoId } };
      delete data.cursoId;
    }

    return this.prisma.turma.update({
      where: { id },
      data
    });
  }

  async remove(adminId: string, id: string) {
    await this.findOne(adminId, id);
    return this.prisma.turma.delete({ where: { id } });
  }

  private async validateRelations(
    dto: CreateTurmaDto | UpdateTurmaDto, 
    adminId: string, 
    turmaId?: string
  ) {
    // Verifica código único
    if (dto.codigo) {
      const existing = await this.prisma.turma.findFirst({
        where: { 
          codigo: dto.codigo,
          NOT: { id: turmaId }
        }
      });
      if (existing) throw new ConflictException('Código da turma já existe');
    }

    // Verifica se o curso existe e pertence ao admin
    if (dto.cursoId) {
      const curso = await this.prisma.curso.findUnique({
        where: { id: dto.cursoId, adminId }
      });
      if (!curso) throw new NotFoundException('Curso não encontrado');
    }
  }
}