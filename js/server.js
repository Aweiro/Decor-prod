require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const db = require('./firebase'); // підключення до Firestore
const { v4: uuidv4 } = require('uuid'); // UUID для унікального токена
const { Storage } = require('@google-cloud/storage'); // для роботи з Firebase Storage

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // зберігання у пам'яті

// Firebase Storage
const storage = new Storage();
const bucket = storage.bucket('west-decor.appspot.com'); // Замість цього додайте вашу назву bucket в .env

// Налаштування CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // для обробки form-data

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

// Отримання списку фото
app.get('/photos', async (req, res) => {
    try {
        const photosSnapshot = await db.collection('photos').get();
        const photos = photosSnapshot.docs.map(doc => doc.data());
        res.status(200).json(photos);
    } catch (error) {
        console.error('Помилка отримання фото з Firestore:', error);
        res.status(500).send('Не вдалося отримати фото');
    }
});


app.post('/upload', upload.single('photo'), async (req, res) => {
  console.log("Запит на завантаження фото отримано");
  console.log("Дані форми:", req.body);
  console.log("Файл:", req.file);

  const { description, decorName, price } = req.body;
  if (req.file) {
		const uniqueToken = uuidv4();
      try {
				// const publicUrl = `https://firebasestorage.googleapis.com/v0/b/west-decor.appspot.com/o/uploads%2F1.jpg?alt=media&token=67296033-1b58-45c4-878d-e8a9e424a4e3`;
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(req.file.originalname)}?alt=media&token=${uniqueToken}`;

				
				const newPhoto = {
						name: req.file.originalname,
						url: publicUrl,
						description: description || 'Опис відсутній',
						decorName: decorName || 'Назва декору відсутня',
						price: price ? parseFloat(price) : 0
				};
      
          
          // Додавання фото в колекцію Firestore
          await db.collection('photos').add(newPhoto);
          
          console.log("Фото успішно збережено:", newPhoto);
          res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
      } catch (error) {
          console.error("Помилка збереження фото в Firestore:", error);
          res.status(500).json({ message: 'Не вдалося зберегти фото.' });
      }
  } else {
      console.log("Фото не завантажено");
      res.status(400).json({ message: 'Не вдалося завантажити фото.' });
  }
});

// Додавання нового фото
// app.post('/upload', upload.single('photo'), (req, res) => {
//     const { description, decorName, price } = req.body;

//     if (req.file) {
//         console.log('Файл завантажено:', req.file); // Лог для перевірки

//         const uniqueToken = uuidv4();
//         const blob = bucket.file(`uploads/${req.file.originalname}`);
//         const blobStream = blob.createWriteStream({
//             metadata: {
//                 contentType: req.file.mimetype,
//                 metadata: {
//                     firebaseStorageDownloadTokens: uniqueToken
//                 }
//             }
//         });

//         blobStream.on('error', (error) => {
//             console.error("Помилка завантаження в Firebase Storage:", error);
//             res.status(500).json({ message: 'Не вдалося завантажити фото.' });
//         });

//         blobStream.on('finish', async () => {
//             // const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(req.file.originalname)}?alt=media&token=${uniqueToken}`;
//              const publicUrl = `https://firebasestorage.googleapis.com/v0/b/west-decor.appspot.com/o/uploads%2F1.jpg?alt=media&token=67296033-1b58-45c4-878d-e8a9e424a4e3`;

//             const newPhoto = {
//                 name: req.file.originalname,
//                 url: publicUrl,
//                 description: description || 'Опис відсутній',
//                 decorName: decorName || 'Назва декору відсутня',
//                 price: price ? parseFloat(price) : 0
//             };

//             try {
//                 await db.collection('photos').add(newPhoto);
//                 console.log("Фото успішно збережено:", newPhoto);
//                 res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
//             } catch (error) {
//                 console.error("Помилка збереження в Firestore:", error);
//                 res.status(500).json({ message: 'Не вдалося зберегти фото в Firestore.' });
//             }
//         });

//         blobStream.end(req.file.buffer);
//     } else {
//         res.status(400).json({ message: 'Файл не завантажено.' });
//     }
// });

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
