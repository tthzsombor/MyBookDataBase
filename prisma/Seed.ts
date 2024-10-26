import { PrismaClient, Books, Genres } from '@prisma/client';
import * as argon2 from 'argon2';
const prisma = new PrismaClient();


async function main() {
  try {
    await prisma.genres.createMany({
      data: [
        { genrename: 'Fantasy' },
        { genrename: 'Romantikus' },
        { genrename: 'Horror' },
        { genrename: 'Krimi' },
        { genrename: 'Komédia' },
        { genrename: 'Realizmus' },
        { genrename: 'Kaland' },
        { genrename: 'Filozófia' },
        { genrename: 'Sci-fi' },
        { genrename: 'Történelem' },
        { genrename: 'Szép Irodalom' },
        { genrename: 'Életrajz' },
        { genrename: 'Mese' },
        { genrename: 'Novella' },
        { genrename: 'Vers' },
        { genrename: 'Tragédia' },
        { genrename: 'Egzisztencializmus' },
        {genrename: 'Abszurdizmus'},
      ],
    });
    await prisma.status.createMany({
      data: [
        { statusname: 'Tervben van' },
        { statusname: 'Kiolvasva' },
        { statusname: 'Most olvasom' },
        { statusname: 'Szüneteltetem' },
        { statusname: 'Abbahagytam' },
      ],
    });
    await prisma.books.create({
      data: {
        bookname: 'Bűn és Bűnhődés',
        writer: 'Fjodor Mihajlovics Dosztojevszkij',
        release: 1866,
        image: "https://lira.erbacdn.net/upload/M_28/rek1/508/3423508.jpg",
        genre: {
          connect: { genrename: 'Realizmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'Fehér Éjszakák',
        writer: 'Fjodor Mihajlovics Dosztojevszkij',
        release: 1848,
        image:"https://s01.static.libri.hu/cover/96/e/8253770_4.jpg",
        genre: {
          connect: { genrename: 'Romantikus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'Ördögök',
        writer: 'Fjodor Mihajlovics Dosztojevszkij',
        release: 1872,
        image:"https://moly.hu/system/covers/big/covers_776400.jpg?1669395197",
        genre: {
          connect: { genrename: 'Realizmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'A Karamazov testvérek',
        writer: 'Fjodor Mihajlovics Dosztojevszkij',
        release: 1880,
        image:"https://moly.hu/system/covers/big/covers_711619.jpg?1639053571",
        genre: {
          connect: { genrename: 'Realizmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'A játékos',
        writer: 'Fjodor Mihajlovics Dosztojevszkij',
        release: 1866,
        image:"https://moly.hu/system/covers/big/covers_701607.jpg?1633816774",
        genre: {
          connect: { genrename: 'Realizmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'Feljegyzések az egérlyukból',
        writer: 'Fjodor Mihajlovics Dosztojevszkij',
        release: 1864,
        image:"https://marvin.bline.hu/product_images/1294/ID22-285613.JPG",
        genre: {
          connect: { genrename: 'Realizmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'Közöny',
        writer: 'Albert Camus',
        release: 1942,
        image:"https://s01.static.libri.hu/cover/18/d/9106608_4.jpg",
        genre: {
          connect: { genrename: 'Egzisztencializmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'Pestis',
        writer: 'Albert Camus',
        release: 1947,
        image:"https://s05.static.libri.hu/cover/87/2/5696284_4.jpg",
        genre: {
          connect: { genrename: 'Egzisztencializmus' },
        },
      },
    });
    await prisma.books.create({
      data: {
        bookname: 'Sziszüphosz Mítosza',
        writer: 'Albert Camus',
        release: 1942,
        image: "https://marvin.bline.hu/product_images/888/ID22-327837.JPG",
        genre: {
          connect: { genrename: 'Abszurdizmus' },
        },
      },
    });

    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await argon2.hash("admin"), // Ne felejtsd el hashelni
        username: 'Admin',
        role: 'ADMIN',
      },
    });

  } finally {
    prisma.$disconnect();
  }
}

main();
