import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criação do Admin
  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!defaultAdminEmail || !defaultAdminPassword) {
    throw new Error('Variáveis de ambiente do admin padrão não configuradas');
  }

  let admin = await prisma.admin.findUnique({
    where: { email: defaultAdminEmail },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash(defaultAdminPassword, 10);
    admin = await prisma.admin.create({
      data: {
        email: defaultAdminEmail,
        password: hashedPassword,
      },
    });
    console.log('Admin padrão criado com sucesso');
  }

  // Criação de Cursos
  const cursos = await prisma.curso.createMany({
    data: [
      {
        codigo: 'MAT',
        nome: 'Matemática',
        descricao: 'Introdução à matemática elementar',
        adminId: admin.id,
      },
      {
        codigo: 'FIS',
        nome: 'Física',
        descricao: 'Conceitos básicos de física',
        adminId: admin.id,
      },
      {
        codigo: 'GEO',
        nome: 'Geografia',
        descricao: 'Introdução à programação',
        adminId: admin.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`${cursos.count} cursos criados`);

  // Buscar os cursos criados
  const cursoMat = await prisma.curso.findUnique({ where: { codigo: 'MAT' } });
  const cursoFis = await prisma.curso.findUnique({ where: { codigo: 'FIS' } });
  const cursoGeo = await prisma.curso.findUnique({ where: { codigo: 'GEO' } });

  if (!cursoMat || !cursoFis || !cursoGeo) {
    throw new Error('Um ou mais cursos não foram encontrados');
  }

  // Criação de disciplina com cursoId correto
  const disciplina = await prisma.disciplina.create({
    data: {
      codigo: 'GEO001',
      nome: 'Climatologia',
      descricao: 'Definido pelo professor',
      cargaHoraria: 66,
      periodo: '2',
      cursoId: cursoGeo.id,
      adminId: admin.id,
    }
  });
  console.log(`1 disciplina criada`);

  // Criação de Professores
  const professores = await prisma.professor.createMany({
    data: [
      {
        matricula: '25P00001',
        nomeCompleto: 'Ana Silva',
        dataNascimento: new Date('1980-05-15'),
        especialidade: 'Matemática',
        email: 'ana.silva@escola.com',
        password: await bcrypt.hash('defaultPassword1', 10),
        adminId: admin.id,
      },
      {
        matricula: '25P00002',
        nomeCompleto: 'Carlos Oliveira',
        dataNascimento: new Date('1975-11-22'),
        especialidade: 'Física',
        email: 'carlos.oliveira@escola.com',
        password: await bcrypt.hash('defaultPassword2', 10),
        adminId: admin.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`${professores.count} professores criados`);

  // Criação de Alunos com cursoId correto
  const alunos = await prisma.aluno.createMany({
    data: [
      {
        matricula: '25A00001',
        nomeCompleto: 'João Pereira',
        dataNascimento: new Date('2005-03-20'),
        curso: cursoMat.id,
        email: 'joao.pereira@escola.com',
        password: await bcrypt.hash('defaultPassword1', 10),
        adminId: admin.id,
      },
      {
        matricula: '25A00002',
        nomeCompleto: 'Maria Santos',
        dataNascimento: new Date('2006-07-12'),
        curso: cursoFis.id,
        email: 'maria.santos@escola.com',
        password: await bcrypt.hash('defaultPassword2', 10),
        adminId: admin.id,
      },
    ],
    skipDuplicates: true,
  });
  console.log(`${alunos.count} alunos criados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
