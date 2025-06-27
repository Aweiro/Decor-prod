// [1] --- ІМПОРТИ ТА НАЛАШТУВАННЯ ---
require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const { db, bucket } = require('./firebase');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// [2] --- СТАТИЧНІ ФАЙЛИ ---
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/assets/css', express.static(path.join(__dirname, '../assets/css')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/img', express.static(path.join(__dirname, '../img')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// [3] --- HTML МАРШРУТИ ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/product.html', (req, res) => res.sendFile(path.join(__dirname, '../product.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '../about.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../admin.html')));
app.get('/portfolio', (req, res) => res.sendFile(path.join(__dirname, '../portfolio.html')));
app.get('/reviews', (req, res) => res.sendFile(path.join(__dirname, '../reviews.html')));

// [4] --- ФОТО ---
app.get('/photos', async (req, res) => {
  try {
    const snapshot = await db.collection('photos').orderBy('timestamp', 'asc').get();
    const photos = snapshot.docs.map(doc => doc.data());
    res.status(200).json(photos);
  } catch (error) {
    console.error('Помилка отримання фото:', error);
    res.status(500).send('Не вдалося отримати фото');
  }
});

app.get('/photos/:id', async (req, res) => {
  try {
    const doc = await db.collection('photos').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Фото не знайдено' });
    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера' });
  }
});

app.delete('/photos/:name', async (req, res) => {
  try {
    const snapshot = await db.collection('photos').where('name', '==', req.params.name).get();
    if (snapshot.empty) return res.status(404).json({ message: 'Фото не знайдено' });
    await Promise.all(snapshot.docs.map(doc => doc.ref.delete()));
    res.status(200).json({ message: 'Фото успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося видалити фото' });
  }
});

app.post('/upload', upload.single('photo'), async (req, res) => {
  const { file, body } = req;
  if (!file) return res.status(400).json({ message: 'Файл відсутній' });

  const { description, decorName, price } = body;
  const uniqueToken = uuidv4();
  const blob = bucket.file(`uploads/${file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: { firebaseStorageDownloadTokens: uniqueToken },
    },
  });

  blobStream.on('error', error => res.status(500).json({ message: 'Помилка завантаження' }));
  blobStream.on('finish', async () => {
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(file.originalname)}?alt=media&token=${uniqueToken}`;
    const docRef = db.collection('photos').doc();
    const newPhoto = {
      id: docRef.id,
      name: file.originalname,
      url: publicUrl,
      description: description || 'Опис відсутній',
      decorName: decorName || 'Назва декору відсутня',
      price: price ? parseFloat(price) : 0,
      timestamp: new Date()
    };
    await docRef.set(newPhoto);
    res.status(200).json({ message: 'Фото успішно завантажено', file: newPhoto });
  });

  blobStream.end(file.buffer);
});

// [4] --- РЕДАГУВАННЯ ---
app.patch('/photos/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    speed,
    location,
    application,
    noteValues,
    characteristics
  } = req.body;

  try {
    const ref = db.collection('photos').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Фото не знайдено' });

    const updatedData = {
      decorName: name ?? doc.data().decorName,
      description: description ?? doc.data().description,
      price: price ?? doc.data().price,
      speed,
      location,
      application,
      noteValues: Array.isArray(noteValues) ? noteValues : [],
      characteristics: Array.isArray(characteristics) ? characteristics : [],
      timestamp: new Date()
    };

    await ref.update(updatedData);
    res.status(200).json({ message: 'Інформацію оновлено' });
  } catch (error) {
    console.error('❌ Помилка оновлення:', error);
    res.status(500).json({ message: 'Не вдалося оновити інформацію' });
  }
});



// [5] --- ДОДАТКОВА ІНФОРМАЦІЯ ДЛЯ ПРОДУКТУ ---
async function uploadImageToFirebase(file) {
  const uniqueToken = uuidv4();
  const blob = bucket.file(`uploads/${file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: { firebaseStorageDownloadTokens: uniqueToken },
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(file.originalname)}?alt=media&token=${uniqueToken}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}

app.patch('/api/products/:id/add-info', upload.array('productImages', 3), async (req, res) => {
  const { id } = req.params;
  const { speed, location, application, characteristics } = req.body;
  const noteValues = req.body.noteValues;
  const productImages = req.files;

  try {
    const ref = db.collection('photos').doc(id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: 'Товар не знайдено' });

    const updatedFields = {};
    if (speed) updatedFields.speed = speed;
    if (location) updatedFields.location = location;
    if (application) updatedFields.application = application;
    if (noteValues) updatedFields.noteValues = Array.isArray(noteValues) ? noteValues : [noteValues];

    if (characteristics) {
      try {
        updatedFields.characteristics = typeof characteristics === 'string'
          ? JSON.parse(characteristics)
          : characteristics;
      } catch {
        return res.status(400).json({ message: 'Невірний формат характеристик' });
      }
    }

    if (productImages?.length) {
      const imageUrls = await Promise.all(productImages.map(uploadImageToFirebase));
      updatedFields.images = imageUrls;
    }

    await ref.update(updatedFields);
    res.status(200).json({ message: 'Інформація успішно додана' });
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося додати інформацію' });
  }
});

// [6] --- ВІДГУКИ ---
app.get('/api/reviews', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').get();
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося отримати відгуки' });
  }
});

app.get('/api/reviews/pending', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').where('approved', '==', false).get();
    res.status(200).json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).send('Помилка отримання відгуків');
  }
});

app.get('/api/reviews/approved', async (req, res) => {
  try {
    const snapshot = await db.collection('reviews').where('approved', '==', true).get();
    res.status(200).json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося отримати схвалені відгуки' });
  }
});

app.patch('/api/reviews/approve/:id', async (req, res) => {
  try {
    await db.collection('reviews').doc(req.params.id).update({ approved: true });
    res.status(200).json({ message: 'Відгук схвалено' });
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося схвалити відгук' });
  }
});

app.post('/api/reviews/add', async (req, res) => {
  try {
    const { name, text } = req.body;
    await db.collection('reviews').add({
      name: name.trim(),
      text: text.trim(),
      approved: false,
      createdAt: new Date()
    });
    res.status(200).json({ message: 'Відгук додано і очікує на схвалення' });
  } catch (error) {
    res.status(500).send('Помилка додавання відгуку');
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    await db.collection('reviews').doc(req.params.id).delete();
    res.status(200).json({ message: 'Відгук успішно видалено' });
  } catch (error) {
    res.status(500).json({ message: 'Не вдалося видалити відгук' });
  }
});

// [7] --- ПЕРЕВІРКА ПАРОЛЯ АДМІНА ---
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
app.post('/check-password', async (req, res) => {
  try {
    const isValid = await bcrypt.compare(req.body.password, adminPasswordHash);
    res.json({ success: isValid });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});

// [8] --- СТАРТ СЕРВЕРА ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
