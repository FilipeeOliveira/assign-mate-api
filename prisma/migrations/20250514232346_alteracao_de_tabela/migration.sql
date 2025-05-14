/*
  Warnings:

  - The values [NORTURNO] on the enum `Turno` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Turno_new" AS ENUM ('MATUTINO', 'VESPERTINO', 'NOTURNO');
ALTER TABLE "Turma" ALTER COLUMN "turno" TYPE "Turno_new" USING ("turno"::text::"Turno_new");
ALTER TYPE "Turno" RENAME TO "Turno_old";
ALTER TYPE "Turno_new" RENAME TO "Turno";
DROP TYPE "Turno_old";
COMMIT;
