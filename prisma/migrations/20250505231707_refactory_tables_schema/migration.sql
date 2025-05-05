/*
  Warnings:

  - The values [SEMI_PRESENCIAL] on the enum `Modalidade` will be removed. If these variants are still used in the database, this will fail.
  - The values [MANHA,TARDE,NOITE] on the enum `Turno` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nome` on the `Turma` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Modalidade_new" AS ENUM ('PRESENCIAL', 'EAD', 'HIBRIDO');
ALTER TABLE "Turma" ALTER COLUMN "modalidade" TYPE "Modalidade_new" USING ("modalidade"::text::"Modalidade_new");
ALTER TYPE "Modalidade" RENAME TO "Modalidade_old";
ALTER TYPE "Modalidade_new" RENAME TO "Modalidade";
DROP TYPE "Modalidade_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Turno_new" AS ENUM ('MATUTINO', 'VESPERTINO', 'NORTURNO');
ALTER TABLE "Turma" ALTER COLUMN "turno" TYPE "Turno_new" USING ("turno"::text::"Turno_new");
ALTER TYPE "Turno" RENAME TO "Turno_old";
ALTER TYPE "Turno_new" RENAME TO "Turno";
DROP TYPE "Turno_old";
COMMIT;

-- AlterTable
ALTER TABLE "Turma" DROP COLUMN "nome";
