const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const db = require('./firebase');

const bodyParser = require('body-parser');
const upload = multer({ dest: 'uploads/' });

const app = express();
// const PORT = process.env.PORT || 3000;

// Налаштування CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Додаємо для обробки form-data

// Налаштування статичних файлів
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/img', express.static(path.join(__dirname, '../img')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// Перевірка та створення директорії uploads
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// Налаштування для зберігання файлів
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage: storage });

// Функція для читання photos.json
// const readPhotosJson = () => {
//     const filePath = path.join(__dirname, 'photos.json');
//     if (!fs.existsSync(filePath)) {
//         fs.writeFileSync(filePath, JSON.stringify([])); // Створити файл, якщо його немає
//     }
//     const data = fs.readFileSync(filePath);
//     return JSON.parse(data);
// };

// Функція для запису у photos.json
// const writePhotosJson = (photos) => {
//     const filePath = path.join(__dirname, 'photos.json');
//     fs.writeFileSync(filePath, JSON.stringify(photos, null, 2));
// };

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

// Обробка запиту на завантаження фото
// app.post('/upload', upload.single('photo'), (req, res) => {
//     console.log("Запит на завантаження фото отримано"); // Лог для підтвердження запиту
//     console.log("Дані форми:", req.body);
//     console.log("Файл:", req.file);

//     const { description, decorName, price } = req.body;
//     if (req.file) {
//         const photos = readPhotosJson();
//         const newPhoto = {
//             name: req.file.filename,
//             url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
//             description: description || 'Опис відсутній',
//             decorName: decorName || 'Назва декору відсутня',
//             price: price ? parseFloat(price) : 0
//         };
//         photos.push(newPhoto);
//         writePhotosJson(photos);
        
//         console.log("Фото успішно збережено:", newPhoto); // Лог для підтвердження збереження
//         res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
//     } else {
//         console.log("Фото не завантажено"); // Лог для випадку, коли файл не завантажено
//         res.status(400).json({ message: 'Не вдалося завантажити фото.' });
//     }
// });

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


// Додавання нового фото
if (req.file) {
	const uniqueToken = uuidv4();
	const blob = bucket.file(`uploads/${req.file.filename}`);
	const blobStream = blob.createWriteStream({
			metadata: {
					contentType: req.file.mimetype,
					metadata: {
							firebaseStorageDownloadTokens: uniqueToken
					}
			}
	});

	blobStream.on('error', (error) => {
			console.error("Помилка завантаження в Firebase Storage:", error);
			res.status(500).json({ message: 'Не вдалося завантажити фото.' });
	});

	blobStream.on('finish', async () => {
			const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/uploads%2F${encodeURIComponent(req.file.filename)}?alt=media&token=${uniqueToken}`;

			const newPhoto = {
					name: req.file.filename,
					url: publicUrl,
					description: description || 'Опис відсутній',
					decorName: decorName || 'Назва декору відсутня',
					price: price ? parseFloat(price) : 0
			};

			try {
					await db.collection('photos').add(newPhoto);
					console.log("Фото успішно збережено:", newPhoto);
					res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
			} catch (error) {
					console.error("Помилка збереження в Firestore:", error);
					res.status(500).json({ message: 'Не вдалося зберегти фото в Firestore.' });
			}
	});

	blobStream.end(req.file.buffer);
} else {
	res.status(400).json({ message: 'Не вдалося завантажити фото.' });
}



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});