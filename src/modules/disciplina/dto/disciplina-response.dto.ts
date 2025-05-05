import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DisciplinaResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  codigo: string;

  @Expose()
  @ApiProperty()
  nome: string;

  @Expose()
  @ApiProperty({ required: false })
  descricao?: string;

  @Expose()
  @ApiProperty()
  cargaHoraria: number;

  @Expose()
  @ApiProperty()
  periodo: string;

  @Expose()
  @ApiProperty()
  cursoId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @ApiProperty({ type: Object })
  curso: {
    id: string;
    codigo: string;
    nome: string;
  };
}