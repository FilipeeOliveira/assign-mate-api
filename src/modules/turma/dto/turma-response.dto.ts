import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TurmaResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  codigo: string;

  @Expose()
  @ApiProperty()
  semestre: string;

  @Expose()
  @ApiProperty({ enum: ['MATUTINO', 'VESPETINO', 'NOTURNO'] })
  turno: string;

  @Expose()
  @ApiProperty({ enum: ['PRESENCIAL', 'EAD', 'HIBRIDO'] })
  modalidade: string;

  @Expose()
  @ApiProperty()
  cursoId: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}