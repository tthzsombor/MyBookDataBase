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
        {
          bookname: 'Az aranyember',
          writer: 'Jókai Mór',
          release: 1872,
          image: "https://s06.static.libri.hu/cover/28/6/616058_5.jpg",
          genreId: 1, // Fantasy
        },
        {
          bookname: '1984',
          writer: 'George Orwell',
          release: 1949,
          image: "https://s06.static.libri.hu/cover/3a/f/9559171_5.jpg",
          genreId: 9, // Sci-fi
        },
        {
          bookname: 'A kis herceg',
          writer: 'Antoine de Saint-Exupéry',
          release: 1943,
          image: "https://s06.static.libri.hu/cover/5a/2/2104945_5.jpg",
          genreId: 14, // Mese
        },
        {
          bookname: 'Az ötödik pecsét',
          writer: 'Sánta Ferenc',
          release: 1963,
          image: "https://s06.static.libri.hu/cover/bb/5/9653966_5.jpg",
          genreId: 10, // Történelem
        },
        {
          bookname: 'Hamlet',
          writer: 'William Shakespeare',
          release: 1603,
          image: "https://s06.static.libri.hu/cover/8e/9/9972157_5.jpg",
          genreId: 16, // Tragédia
        },
        {
          bookname: 'Moby Dick',
          writer: 'Herman Melville',
          release: 1851,
          image: "https://s01.static.libri.hu/cover/23/1/3348164_4.jpg",
          genreId: 7, // Kaland
        },
        {
          bookname: 'Átváltozás',
          writer: 'Franz Kafka',
          release: 1915,
          image: "https://s01.static.libri.hu/cover/55/9/9269991_4.jpg",
          genreId: 18, // Abszurdizmus
        },
        {
          bookname: 'Anna Karenina',
          writer: 'Lev Tolsztoj',
          release: 1878,
          image: "https://s01.static.libri.hu/cover/b8/5/4284860_4.jpg",
          genreId: 2, // Romantikus
        },
        {
          bookname: 'Vörös és fekete',
          writer: 'Stendhal',
          release: 1830,
          image: "https://s01.static.libri.hu/cover/ba/3/1080007_4.jpg",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'Az idő rövid története',
          writer: 'Stephen Hawking',
          release: 1988,
          image: "https://s06.static.libri.hu/cover/28/0/8376372_5.jpg",
          genreId: 10, // Történelem
        },
        {
          bookname: 'Galaxis Útikalauz Stopposoknak',
          writer: 'Douglas Adams',
          release: 1979,
          image: "https://s01.static.libri.hu/cover/70/4/5938480_4.jpg",
          genreId: 9, // Sci-fi
        },
        {
          bookname: 'Pán Péter',
          writer: 'J. M. Barrie',
          release: 1911,
          image: "https://s01.static.libri.hu/cover/7f/f/3457831_4.jpg",
          genreId: 14, // Mese
        },
        {
          bookname: 'A rózsa neve',
          writer: 'Umberto Eco',
          release: 1980,
          image: "https://s01.static.libri.hu/cover/df/d/9691652_4.jpg",
          genreId: 4, // Krimi
        },
        {
          bookname: 'Az élet értelme',
          writer: 'Monty Python',
          release: 1983,
          image: "https://s01.static.libri.hu/cover/c5/8/729473_4.jpg",
          genreId: 5, // Komédia
        },
        {
          bookname: 'Harry Potter és a bölcsek köve',
          writer: 'J.K. Rowling',
          release: 1997,
          image: "https://s01.static.libri.hu/cover/b6/f/716048_4.jpg",
          genreId: 1, // Fantasy
        },
        {
          bookname: 'A mester és Margarita',
          writer: 'Mihail Bulgakov',
          release: 1967,
          image: "https://s01.static.libri.hu/cover/ac/1/656906_4.jpg",
          genreId: 18, // Abszurdizmus
        },
        {
          bookname: 'A filozófia vigasztalásai',
          writer: 'Boethius',
          release: 524,
          image: "https://moly.hu/system/covers/big/covers_159391.jpg",
          genreId: 8, // Filozófia
        },
        {
          bookname: 'Állam',
          writer: 'Platón',
          release: -380,
          image: "https://moly.hu/system/covers/big/covers_427452.jpg",
          genreId: 8, // Filozófia
        },
        {
          bookname: 'Gyilkosság az Orient expresszen',
          writer: 'Agatha Christie',
          release: 1934,
          image: "https://moly.hu/system/covers/big/covers_820826.jpg",
          genreId: 4, // Krimi
        },
        {
          bookname: 'A félkegyelmű',
          writer: 'Fjodor Mihajlovics Dosztojevszkij',
          release: 1869,
          image: "https://s01.static.libri.hu/cover/86/d/736216_4.jpg",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'Don Quijote',
          writer: 'Miguel de Cervantes',
          release: 1605,
          image: "https://marvin.bline.hu/product_images/1417/B42261.JPG",
          genreId: 7, // Kaland
        },
        {
          bookname: 'A varázshegy',
          writer: 'Thomas Mann',
          release: 1924,
          image: "https://s01.static.libri.hu/cover/24/d/1154750_4.jpg",
          genreId: 6, // Realizmus
        },
        {
          bookname: 'Frankenstein',
          writer: 'Mary Shelley',
          release: 1818,
          image: "https://s01.static.libri.hu/cover/21/6/5092990_4.jpg",
          genreId: 3, // Horror
        },
        {
          bookname: 'Anna Frank naplója',
          writer: 'Anne Frank',
          release: 1947,
          image: "https://s01.static.libri.hu/cover/87/a/680549_4.jpg",
          genreId: 12, // Életrajz
        },
        //---------------------------------------
        // Fantasy
    {
      bookname: 'A Gyűrűk Ura',
      writer: 'J.R.R. Tolkien',
      release: 1954,
      image: "https://moly.hu/system/covers/big/covers_695846.jpg",
      genreId: 1, // Fantasy
    },
  
    // Romantikus
    {
      bookname: 'Büszkeség és Balítélet',
      writer: 'Jane Austen',
      release: 1813,
      image: "https://s01.static.libri.hu/cover/6f/7/6585783_4.jpg",
      genreId: 2, // Romantikus
    },
    {
      bookname: 'A Vörös Pimpernel',
      writer: 'Orczy Emma',
      release: 1905,
      image: "https://s01.static.libri.hu/cover/99/0/4571691_4.jpg",
      genreId: 2, // Romantikus
    },
    {
      bookname: 'Az Érzelem és Értelem',
      writer: 'Jane Austen',
      release: 1811,
      image: "https://s01.static.libri.hu/cover/bb/0/729311_4.jpg",
      genreId: 2, // Romantikus
    },
    {
      bookname: 'A Vihar',
      writer: 'William Shakespeare',
      release: 1611,
      image: "https://s01.static.libri.hu/cover/ae/0/2595847_4.jpg",
      genreId: 2, // Romantikus
    },
    
    
    // Horror
    {
      bookname: 'Drakula',
      writer: 'Bram Stoker',
      release: 1897,
      image: "https://s01.static.libri.hu/cover/b5/4/6168388_4.jpg",
      genreId: 3, // Horror
    },
    {
      bookname: 'A Ragyogás',
      writer: 'Stephen King',
      release: 1977,
      image: "https://s06.static.libri.hu/cover/sl/25/2/252580369a2963c2f28cf532fd2902ed_big.jpg",
      genreId: 3, // Horror
    },
    {
      bookname: 'A Búra alatt',
      writer: 'Stephen King',
      release: 2009,
      image: "https://s01.static.libri.hu/cover/fd/f/9268322_4.jpg",
      genreId: 3, // Horror
    },

    // Krimi
    {
      bookname: 'Tíz Kicsi Néger',
      writer: 'Agatha Christie',
      release: 1939,
      image: "https://s01.static.libri.hu/cover/24/5/5723717_4.jpg",
      genreId: 4, // Krimi
    },
    {
      bookname: 'Holtodiglan',
      writer: 'Gillian Flynn',
      release: 2020,
      image: "https://s01.static.libri.hu/cover/6e/b/6112338_4.jpg",
      genreId: 4, // Krimi
    },

    // Komédia
    {
      bookname: 'A szőke ciklon',
      writer: 'Rejtő Jenő',
      release: 1939,
      image: "https://lira.erbacdn.net/upload/M_28/rek1/243/2862243.jpg",
      genreId: 5, // Komédia
    },
    {
      bookname: 'Egy hölgy talpig pácban',
      writer: 'M. C. Beaton',
      release: 2023,
      image: "https://s01.static.libri.hu/cover/fe/0/9873497_4.jpg",
      genreId: 5, // Komédia
    },
    {
      bookname: 'Léghajóval a világ körül',
      writer: 'Gerald Durrell',
      release: 1990,
      image: "https://s01.static.libri.hu/cover/72/5/733739_4.jpg",
      genreId: 5, // Komédia
    },
    {
      bookname: 'Ezen a vonaton mindenki gyanús',
      writer: 'Benjamin Stevenson',
      release: 2023,
      image: "https://s01.static.libri.hu/cover/90/9/11213714_4.jpg",
      genreId: 5, // Komédia
    },


    // Kaland
    {
      bookname: 'Robinson Crusoe',
      writer: 'Daniel Defoe',
      release: 1719,
      image: "https://s01.static.libri.hu/cover/ce/0/712657_4.jpg",
      genreId: 7, // Kaland
    },
    {
      bookname: 'A három testőr',
      writer: 'Alexandre Dumas',
      release: 1844,
      image: "https://s01.static.libri.hu/cover/cd/9/706407_4.jpg",
      genreId: 7, // Kaland
    },

    // Filozófia
    {
      bookname: 'Szókratész védőbeszéde',
      writer: 'Platón',
      release: 399,
      image: "https://s01.static.libri.hu/cover/bc/5/6640363_4.jpg",
      genreId: 8, // Filozófia
    },
    {
      bookname: 'Az ember nagysága és nyomorúsága',
      writer: 'Blaise Pascal',
      release: 1623,
      image: "https://s06.static.libri.hu/cover/e2/5/819868_5.jpg",
      genreId: 8, // Filozófia
    },
    {
      bookname: 'A tiszta ész kritikája',
      writer: 'Kant Immanuel',
      release: 1781 ,
      image: "https://marvin.bline.hu/product_images/67/B829955.JPG",
      genreId: 8, // Filozófia
    },
    {
      bookname: 'Schelling értekezése az emberi szabadság lényegéről',
      writer: 'Martin Heidegger',
      release: 1809,
      image: "https://s06.static.libri.hu/cover/sl/e8/1/e8135abd08f1bc080602c59edb98dfa0_big.jpg",
      genreId: 8, // Filozófia
    },

    // Sci-fi
    {
      bookname: 'Dűne',
      writer: 'Frank Herbert',
      release: 1965,
      image: "https://s01.static.libri.hu/cover/b5/c/5828424_4.jpg",
      genreId: 9, // Sci-fi
    },
    {
      bookname: 'Az Alapítvány',
      writer: 'Isaac Asimov',
      release: 1951,
      image: "https://s01.static.libri.hu/cover/9b/7/7587628_4.jpg",
      genreId: 9, // Sci-fi
    },
    {
      bookname: 'Neuromancer',
      writer: 'William Gibson',
      release: 1984,
      image: "https://s01.static.libri.hu/cover/a4/e/7961351_4.jpg",
      genreId: 9, // Sci-fi
    },
    {
      bookname: 'Az időgép',
      writer: 'H.G. Wells',
      release: 1895,
      image: "https://s01.static.libri.hu/cover/30/c/3940856_4.jpg",
      genreId: 9, // Sci-fi
    },

    // Történelem
    {
      bookname: 'A második világháború',
      writer: 'Winston Churchill',
      release: 1948,
      image: "https://marvin.bline.hu/product_images/388/1111010298208G.JPG",
      genreId: 10, // Történelem
    },
    {
      bookname: 'Egy anya bátorsága',
      writer: 'Malka Levine',
      release: 2024,
      image: "https://s01.static.libri.hu/cover/35/6/11270038_4.jpg",
      genreId: 10, // Történelem
    },
    {
      bookname: 'Az auschwitzi tetováló',
      writer: 'Heather Morris',
      release: 2024,
      image: "https://marvin.bline.hu/product_images/129/ID22-349596.JPG",
      genreId: 10, // Történelem
    },
    {
      bookname: 'Az auschwitzi bába',
      writer: 'Anna Stuart',
      release: 2023,
      image: "https://marvin.bline.hu/product_images/102/ID22-342210.JPG",
      genreId: 10, // Történelem
    },
    {
      bookname: 'A lány, aki túlélte Auschwitzot',
      writer: 'Eti Elboim  Sara Leibovits',
      release: 2024,
      image: "https://marvin.bline.hu/product_images/702/ID22-349320.JPG",
      genreId: 10, // Történelem
    },

    // Szép Irodalom

    // Életrajz

    // Mese
    {
      bookname: 'A Kisfiú, a Vakond, a Róka és a Ló',
      writer: 'Charlie Mackesy',
      release: 2020  ,
      image: "https://s01.static.libri.hu/cover/92/f/6925579_4.jpg",
      genreId: 13, // Mese
    },
    {
      bookname: 'Mátyás király és az aranycsináló',
      writer: 'Kisbán Gyula',
      release: 2018,
      image: "https://s01.static.libri.hu/cover/97/b/4934907_4.jpg",
      genreId: 13, // Mese
    },
    {
      bookname: 'Mesék a bátorságról',
      writer: 'Csóka Judit',
      release: 2024,
      image: "https://s01.static.libri.hu/cover/60/b/11173847_4.jpg",
      genreId: 13, // Mese
    },
    {
      bookname: 'Az Ezeregyéjszaka meséi',
      writer: 'nem ismert',
      release: 0,
      image: "https://s01.static.libri.hu/cover/a1/f/11076523_4.jpg",
      genreId: 13, // Mese
    },
    {
      bookname: 'Sanyi Manó könyve',
      writer: 'Mikes Lajos',
      release: 2011,
      image: "https://s01.static.libri.hu/cover/8e/6/829358_4.jpg",
      genreId: 13, // Mese
    },

    // Novella
    {
      bookname: 'Az öreg halász és a tenger',
      writer: 'Hemingway',
      release: 1952,
      image: "https://s01.static.libri.hu/cover/89/9/6655999_4.jpg",
      genreId: 14, // Novella
    },
    {
      bookname: 'Válás Budán',
      writer: 'Márai Sándor',
      release: 1935,
      image: "https://s01.static.libri.hu/cover/a1/a/9565806_4.jpg",
      genreId: 14, // Novella
    },
    {
      bookname: 'Radnóti Miklós összegyűjtött versek',
      writer: 'Radnóti Miklós',
      release: 2018,
      image: 'https://s01.static.libri.hu/cover/c9/5/3493012_4.jpg',
      genreId: 15, // Vers
    },
    {
      bookname: 'Tej és méz',
      writer: 'Rupi Kaur',
      release: 2018,
      image: 'https://s01.static.libri.hu/cover/41/3/4912453_4.jpg',
      genreId: 15, // Vers
    },
    {
      bookname: 'Pilinszky János összes versei',
      writer: 'Pilinszky János',
      release: 2024,
      image: 'https://s01.static.libri.hu/cover/9e/e/11319553_4.jpg',
      genreId: 15, // Vers
    },
    {
      bookname: 'József Attila összes versei',
      writer: 'József Attila',
      release: 2022,
      image: 'https://s01.static.libri.hu/cover/64/e/3493011_4.jpg',
      genreId: 15, // Vers
    },
    {
      bookname: 'Petőfi Sándor összes versei',
      writer: 'Petőfi Sándor',
      release: 2022,
      image: 'https://s01.static.libri.hu/cover/63/e/8509333_4.jpg',
      genreId: 15, // Vers
    },
    {
      bookname: 'Tartuffe',
      writer: 'Moliére',
      release: 1664,
      image: 'https://s01.static.libri.hu/cover/cc/0/11013915_4.jpg',
      genreId: 5, // Konédia
    },
    {
      bookname: 'Isteni Színjáték',
      writer: 'Alighieri Dante',
      release: 1321,
      image: 'https://s01.static.libri.hu/cover/87/9/3267465_4.jpg',
      genreId: 16, // Tragédia
    },
    {
      bookname: 'Antigoné',
      writer: 'Szophoklész',
      release: -441,
      image: 'https://s01.static.libri.hu/cover/38/f/10398411_4.jpg',
      genreId: 16, // Tragédia
    },
    {
      bookname: 'Az ember tragédiája',
      writer: 'Madách Imre',
      release: 1862,
      image: 'https://s01.static.libri.hu/cover/14/9/821368_4.jpg',
      genreId: 16, // Tragédia
    },
    {
      bookname: 'Othello',
      writer: 'William Shakespeare',
      release: 1603,
      image: 'https://s01.static.libri.hu/cover/c4/9/2584054_4.jpg',
      genreId: 16, // Tragédia
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
