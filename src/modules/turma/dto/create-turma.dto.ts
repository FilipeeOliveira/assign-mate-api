import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Turno, Modalidade } from '@prisma/client';

export class CreateTurmaDto {
  @ApiProperty({ example: 'TURMA2023-1' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ example: '2023.1' })
  @IsString()
  @IsNotEmpty()
  semestre: string;


  @ApiProperty({ enum: Turno })
  @IsEnum(Turno)
  turno: Turno;

  @ApiProperty({ enum: Modalidade })
  @IsEnum(Modalidade)
  modalidade: Modalidade;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  cursoId: string;
}