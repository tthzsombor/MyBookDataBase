import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  try {
    // Műfajok létrehozása
    const genres = await prisma.genres.createMany({
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
        { genrename: 'Abszurdizmus' },
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

    // Könyvek létrehozása műfajkapcsolatokkal
    await prisma.books.createMany({
      data: [
        {
          bookname: 'Bűn és Bűnhődés',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1866,
          image: "https://lira.erbacdn.net/upload/M_28/rek1/508/3423508.jpg",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'Fehér Éjszakák',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1848,
          image: "https://s01.static.libri.hu/cover/96/e/8253770_4.jpg",
          genreId: 2, // Romantikus
        },
        {
          bookname: 'Ördögök',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1872,
          image: "https://moly.hu/system/covers/big/covers_776400.jpg?1669395197",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'A Karamazov testvérek',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1880,
          image: "https://moly.hu/system/covers/big/covers_711619.jpg?1639053571",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'A játékos',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1866,
          image: "https://moly.hu/system/covers/big/covers_701607.jpg?1633816774",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'Feljegyzések az egérlyukból',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1864,
          image: "https://marvin.bline.hu/product_images/1294/ID22-285613.JPG",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'Közöny',
          writer: 'Albert Camus',
          release: 1942,
          image: "https://s01.static.libri.hu/cover/18/d/9106608_4.jpg",
          genreId: 17, // Egzisztencializmus
        },
        {
          bookname: 'Pestis',
          writer: 'Albert Camus',
          release: 1947,
          image: "https://s05.static.libri.hu/cover/87/2/5696284_4.jpg",
          genreId: 17, // Egzisztencializmus
        },
        {
          bookname: 'Sziszüphosz Mítosza',
          writer: 'Albert Camus',
          release: 1942,
          image: "https://marvin.bline.hu/product_images/888/ID22-327837.JPG",
          genreId: 17, // Egzisztencializmus
        },
      ],
    });

    // Admin felhasználó létrehozása
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: await argon2.hash("admin"),
        username: 'Admin',
        role: 'ADMIN',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main();
