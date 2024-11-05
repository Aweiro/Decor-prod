const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // UUID для унікального токена
const { Storage } = require('@google-cloud/storage'); // для роботи з Firebase Storage

const { db, bucket } = require('./firebase'); // Імпортуємо db і bucket з firebase.js


const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // зберігання у пам'яті

// Firebase Storage

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
        const photosSnapshot = await db.collection('photos')
            .orderBy('timestamp', 'asc') // сортування за часовою міткою
            .get();
        const photos = photosSnapshot.docs.map(doc => doc.data());
        res.status(200).json(photos);
    } catch (error) {
        console.error('Помилка отримання фото з Firestore:', error);
        res.status(500).send('Не вдалося отримати фото');
    }
});



//2 ulpoad 

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
				timestamp: new Date() // додає поточний час
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
