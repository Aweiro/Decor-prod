// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const cors = require('cors');
// const { v4: uuidv4 } = require('uuid'); // UUID для унікального токена

// const { db, bucket } = require('./firebase'); // Імпортуємо db і bucket з firebase.js


// const app = express();
// const upload = multer({ storage: multer.memoryStorage() }); // зберігання у пам'яті

// // Firebase Storage

// // Налаштування CORS
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // для обробки form-data

// // Налаштування статичних файлів
// app.use('/css', express.static(path.join(__dirname, '../css')));
// app.use('/img', express.static(path.join(__dirname, '../img')));
// app.use('/js', express.static(path.join(__dirname, '../js')));

// // Маршрути для відображення HTML-сторінок
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '../index.html'));
// });

// app.get('/about', (req, res) => {
//     res.sendFile(path.join(__dirname, '../about.html'));
// });

// app.get('/admin', (req, res) => {
//     res.sendFile(path.join(__dirname, '../admin.html'));
// });

// // Отримання списку фото
// app.get('/photos', async (req, res) => {
//     try {
//         const photosSnapshot = await db.collection('photos')
//             .orderBy('timestamp', 'asc') // сортування за часовою міткою
//             .get();
//         const photos = photosSnapshot.docs.map(doc => doc.data());
//         res.status(200).json(photos);
//     } catch (error) {
//         console.error('Помилка отримання фото з Firestore:', error);
//         res.status(500).send('Не вдалося отримати фото');
//     }
// });



// //2 ulpoad 

// app.post('/upload', upload.single('photo'), async (req, res) => {
//   console.log("Файл отримано для завантаження:", req.file);

//   if (!req.file) {
//     console.error("Файл відсутній у запиті.");
//     return res.status(400).json({ message: 'Не вдалося завантажити фото, файл відсутній.' });
//   }

//   const { description, decorName, price } = req.body;

//   try {
//     const uniqueToken = uuidv4();
//     const blob = bucket.file(`uploads/${req.file.originalname}`);
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: req.file.mimetype,
//         metadata: {
//           firebaseStorageDownloadTokens: uniqueToken,
//         },
//       },
//     });

//     blobStream.on('error', (error) => {
//       console.error("Помилка завантаження в Firebase Storage:", error);
//       res.status(500).json({ message: 'Не вдалося завантажити фото.' });
//     });

//     blobStream.on('finish', async () => {
//       const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(req.file.originalname)}?alt=media&token=${uniqueToken}`;

//       const newPhoto = {
//         name: req.file.originalname,
//         url: publicUrl,
//         description: description || 'Опис відсутній',
//         decorName: decorName || 'Назва декору відсутня',
//         price: price ? parseFloat(price) : 0,
// 				timestamp: new Date() // додає поточний час
//       };

//       try {
//         await db.collection('photos').add(newPhoto);
//         console.log("Фото успішно збережено в Firestore:", newPhoto);
//         res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
//       } catch (error) {
//         console.error("Помилка збереження в Firestore:", error);
//         res.status(500).json({ message: 'Не вдалося зберегти фото в Firestore.' });
//       }
//     });

//     blobStream.end(req.file.buffer);
//   } catch (error) {
//     console.error("Помилка під час обробки файлу:", error);
//     res.status(500).json({ message: 'Помилка завантаження файлу.' });
//   }
// });


// app.delete('/photos/:name', async (req, res) => {
//   const photoName = req.params.name;

//   try {
//       const photoSnapshot = await db.collection('photos').where('name', '==', photoName).get();
      
//       if (photoSnapshot.empty) {
//           return res.status(404).json({ message: 'Фото не знайдено.' });
//       }

//       photoSnapshot.forEach(async doc => {
//           await doc.ref.delete();
//       });
      
//       res.status(200).json({ message: 'Фото успішно видалено.' });
//   } catch (error) {
//       console.error('Помилка видалення фото з Firestore:', error);
//       res.status(500).json({ message: 'Не вдалося видалити фото.' });
//   }
// });



// //rew
// // Маршрут для отримання несхвалених відгуків
// // Маршрут для додавання нового відгуку
// // Отримання несхвалених відгуків


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// app.get('/api/reviews/pending', async (req, res) => {
//   try {
//       const snapshot = await db.collection('reviews').where('approved', '==', false).get();
//       const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       res.status(200).json(reviews);
//   } catch (error) {
//       console.error('Помилка отримання відгуків:', error);
//       res.status(500).send('Помилка отримання відгуків');
//   }
// });

// app.get('/api/reviews/approved', async (req, res) => {
//   try {
//       const reviewsSnapshot = await db.collection('reviews').where('approved', '==', true).get();
//       const approvedReviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       res.status(200).json(approvedReviews);
//   } catch (error) {
//       console.error('Помилка отримання схвалених відгуків:', error);
//       res.status(500).json({ message: 'Не вдалося отримати схвалені відгуки.' });
//   }
// });



// // Додавання нового відгуку
// app.post('/api/reviews/add', async (req, res) => {
//   try {
//       const { name, text } = req.body;
//       await db.collection('reviews').add({
//           name,
//           text,
//           approved: false, // Встановлюємо схвалення за замовчуванням як false
//           createdAt: new Date()
//       });
//       res.status(200).json({ message: 'Відгук додано і очікує на схвалення' });
//   } catch (error) {
//       console.error('Помилка додавання відгуку:', error);
//       res.status(500).send('Помилка додавання відгуку');
//   }
// });




const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // UUID для унікального токена
const { db, bucket } = require('./firebase'); // Імпортуємо db і bucket з firebase.js

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // зберігання у пам'яті

// Налаштування CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // для обробки form-data

// Маршрути API
app.get('/api/reviews/pending', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').where('approved', '==', false).get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Помилка отримання відгуків:', error);
    res.status(500).send('Помилка отримання відгуків');
  }
});

app.get('/api/reviews/approved', async (req, res) => {
  try {
      const reviewsSnapshot = await db.collection('reviews').where('approved', '==', true).get();
      const approvedReviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(approvedReviews);
  } catch (error) {
      console.error('Помилка отримання схвалених відгуків:', error);
      res.status(500).json({ message: 'Не вдалося отримати схвалені відгуки.' });
  }
});


app.post('/api/reviews/add', async (req, res) => {
  try {
      const { name, text } = req.body;

      // Додаємо логування для перевірки отриманих даних
      console.log("Отримано новий відгук:", { name, text });

      // Переконуємось, що обидва поля наявні
      if (!name || !text) {
          return res.status(400).json({ message: 'Поле "name" або "text" відсутнє.' });
      }

      // Додаємо новий відгук до Firestore
      const reviewRef = await db.collection('reviews').add({
          name,
          text,
          approved: false, // Встановлюємо схвалення за замовчуванням як false
          createdAt: new Date()
      });

      console.log("Відгук успішно додано з ID:", reviewRef.id);

      res.status(200).json({ message: 'Відгук додано і очікує на схвалення' });
  } catch (error) {
      console.error('Помилка додавання відгуку:', error);
      res.status(500).send('Помилка додавання відгуку');
  }
});



// Отримання списку фото
app.get('/photos', async (req, res) => {
  try {
    const photosSnapshot = await db.collection('photos').orderBy('timestamp', 'asc').get();
    const photos = photosSnapshot.docs.map(doc => doc.data());
    res.status(200).json(photos);
  } catch (error) {
    console.error('Помилка отримання фото з Firestore:', error);
    res.status(500).send('Не вдалося отримати фото');
  }
});

app.post('/upload', upload.single('photo'), async (req, res) => {
  console.log("Файл отримано для завантаження:", req.file);

  if (!req.file) {
    console.error("Файл відсутній у запиті.");
    return res.status(400).json({ message: 'Не вдалося завантажити фото, файл відсутній.' });
  }

  const { description, decorName, price } = req.body;

  try {
    const uniqueToken = uuidv4();
    const blob = bucket.file(`uploads/${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uniqueToken,
        },
      },
    });

    blobStream.on('error', (error) => {
      console.error("Помилка завантаження в Firebase Storage:", error);
      res.status(500).json({ message: 'Не вдалося завантажити фото.' });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(req.file.originalname)}?alt=media&token=${uniqueToken}`;

      const newPhoto = {
        name: req.file.originalname,
        url: publicUrl,
        description: description || 'Опис відсутній',
        decorName: decorName || 'Назва декору відсутня',
        price: price ? parseFloat(price) : 0,
        timestamp: new Date()
      };

      try {
        await db.collection('photos').add(newPhoto);
        console.log("Фото успішно збережено в Firestore:", newPhoto);
        res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
      } catch (error) {
        console.error("Помилка збереження в Firestore:", error);
        res.status(500).json({ message: 'Не вдалося зберегти фото в Firestore.' });
      }
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error("Помилка під час обробки файлу:", error);
    res.status(500).json({ message: 'Помилка завантаження файлу.' });
  }
});

app.delete('/photos/:name', async (req, res) => {
  const photoName = req.params.name;

  try {
    const photoSnapshot = await db.collection('photos').where('name', '==', photoName).get();
    if (photoSnapshot.empty) {
      return res.status(404).json({ message: 'Фото не знайдено.' });
    }

    photoSnapshot.forEach(async doc => {
      await doc.ref.delete();
    });

    res.status(200).json({ message: 'Фото успішно видалено.' });
  } catch (error) {
    console.error('Помилка видалення фото з Firestore:', error);
    res.status(500).json({ message: 'Не вдалося видалити фото.' });
  }
});

// Налаштування статичних файлів
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/img', express.static(path.join(__dirname, '../img')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// Маршрути для відображення HTML-сторінок
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../about.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('/reviews', (req, res) => {
  res.sendFile(path.join(__dirname, '../reviews.html'));
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





