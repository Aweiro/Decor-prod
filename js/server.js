

require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const multer = require('multer');const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // UUID для унікального токена

const { db, bucket } = require('./firebase'); // Імпортуємо db і bucket з firebase.js
const bodyParser = require('body-parser');
const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // зберігання у пам'яті

// Налаштування CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // для обробки form-data

// Налаштування статичних файлів
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/assets/css', express.static(path.join(__dirname, '../assets/css')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));

app.use('/img', express.static(path.join(__dirname, '../img')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// Маршрути для відображення HTML-сторінок
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/product.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../product.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../about.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, '../portfolio.html'));
});

app.get('/reviews', (req, res) => {
  res.sendFile(path.join(__dirname, '../reviews.html'));
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

// Завантаження фото
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
    
      const docRef = db.collection('photos').doc(); // автоматичне створення унікального ID
    
      const newPhoto = {
        id: docRef.id, // додаємо це поле
        name: req.file.originalname,
        url: publicUrl,
        description: description || 'Опис відсутній',
        decorName: decorName || 'Назва декору відсутня',
        price: price ? parseFloat(price) : 0,
        timestamp: new Date()
      };
    
      try {
        await docRef.set(newPhoto); // саме так, set замість add, бо ми вже створили id
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

// Отримати одне фото за ID
app.get('/photos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection('photos').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Фото не знайдено' });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Помилка отримання товару:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
});


// Видалити фото
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

// Оновлення фото (редагування)
// Оновлення фото (редагування)
app.patch('/photos/:id', async (req, res) => {
  const { id } = req.params;  // отримуємо ID фото з URL
  const { name, description, price } = req.body;  // отримуємо нові дані для фото

  try {
    const photoRef = db.collection('photos').doc(id); // Отримуємо документ фото за ID

    const doc = await photoRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Фото не знайдено' });
    }

    await photoRef.update({
      decorName: name || doc.data().decorName,
      description: description || doc.data().description,
      price: price !== undefined ? price : doc.data().price,
      timestamp: new Date(),  // Оновлюємо мітку часу
    });

    res.status(200).json({ message: 'Інформація успішно оновлена' });
  } catch (error) {
    console.error('Помилка редагування фото:', error);
    res.status(500).json({ message: 'Не вдалося оновити інформацію' });
  }
});

// Додавання інформації для товару
app.use(bodyParser.json());

async function uploadImageToFirebase(file) {
  const uniqueToken = uuidv4();
  const blob = bucket.file(`uploads/${file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uniqueToken,
      },
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => reject(error));
    blobStream.on('finish', async () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(file.originalname)}?alt=media&token=${uniqueToken}`;
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}

app.patch('/api/products/:id/add-info', upload.array('productImages', 3), async (req, res) => {
  const { id } = req.params;
  const { speed, location, application, characteristics } = req.body; // отримуємо характеристики
  const productImages = req.files; // отримуємо файли

  console.log('Received PATCH request for product ID:', id);
  console.log('Data received:', { speed, location, application, characteristics, productImages });

  try {
    const productRef = db.collection('photos').doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Товар не знайдено' });
    }

   // Оновлюємо поля
const updatedFields = {};

// Оновлюємо швидкість роботи, локацію і застосування
if (speed) updatedFields.speed = speed;
if (location) updatedFields.location = location;
if (application) updatedFields.application = application;

// Обробка характеристик
if (characteristics) {
  try {
    // Якщо characteristics передаються як рядок, перетворюємо в масив
    if (typeof characteristics === 'string') {
      updatedFields.characteristics = JSON.parse(characteristics);
    } else if (Array.isArray(characteristics)) {
      updatedFields.characteristics = characteristics;
    } else {
      throw new Error("Невірний формат характеристик");
    }
  } catch (e) {
    console.error("Помилка парсингу характеристик:", e);
    return res.status(400).json({ message: 'Невірний формат характеристик' });
  }
} else {
  console.log('Немає характеристик для додавання');
}


    // Додавання зображень
    if (productImages && productImages.length > 0) {
      const imageUrls = [];
      for (let i = 0; i < productImages.length; i++) {
        const uploadedImageUrl = await uploadImageToFirebase(productImages[i]);
        imageUrls.push(uploadedImageUrl);
      }
      updatedFields.images = imageUrls; // Додаємо зображення до оновлених полів
    }

    console.log('Оновлені поля:', updatedFields);

    // Оновлення товару в базі даних
    await productRef.update(updatedFields);

    res.status(200).json({ message: 'Інформація успішно додана!' });
  } catch (error) {
    console.error('Error while updating product:', error);
    res.status(500).json({ message: 'Не вдалося додати інформацію' });
  }
});









//rew
// // Маршрут для отримання несхвалених відгуків
// // Маршрут для додавання нового відгуку
// // Отримання несхвалених відгуків

// // Маршрут для отримання всіх відгуків
app.get('/api/reviews', async (req, res) => {
  try {
    const reviewsSnapshot = await db.collection('reviews').get();
    const reviews = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Помилка отримання всіх відгуків:', error);
    res.status(500).json({ message: 'Не вдалося отримати відгуки.' });
  }
});


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
//aprove
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

app.patch('/api/reviews/approve/:id', async (req, res) => {
  const reviewId = req.params.id;

  try {
    const reviewRef = db.collection('reviews').doc(reviewId);
    await reviewRef.update({ approved: true });
    res.status(200).json({ message: 'Відгук схвалено' });
  } catch (error) {
    console.error('Помилка схвалення відгуку:', error);
    res.status(500).json({ message: 'Не вдалося схвалити відгук' });
  }
});




// Додавання нового відгуку
app.post('/api/reviews/add', async (req, res) => {
  try {
      const { name, text } = req.body;
      await db.collection('reviews').add({
          name,
          text,
          approved: false, // Встановлюємо схвалення за замовчуванням як false
          createdAt: new Date()
      });
      res.status(200).json({ message: 'Відгук додано і очікує на схвалення' });
  } catch (error) {
      console.error('Помилка додавання відгуку:', error);
      res.status(500).send('Помилка додавання відгуку');
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;

  try {
    // Видаляємо відгук з Firestore
    await db.collection('reviews').doc(reviewId).delete();
    res.status(200).json({ message: 'Відгук успішно видалено' });
  } catch (error) {
    console.error('Помилка видалення відгуку:', error);
    res.status(500).json({ message: 'Не вдалося видалити відгук' });
  }
});

// admin
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;


app.post('/check-password', async (req, res) => {
  const { password } = req.body;
  console.log('Отриманий пароль:', password);
  console.log('Хеш у .env:', adminPasswordHash); // Додано логування хешу

  try {
      const isValid = await bcrypt.compare(password, adminPasswordHash);
      console.log('Результат перевірки:', isValid);
      res.json({ success: isValid });
  } catch (error) {
      console.error('Помилка перевірки пароля:', error);
      res.status(500).json({ success: false, message: 'Помилка сервера' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
