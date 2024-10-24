
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування CORS
app.use(cors());
app.use(express.json()); // Додаємо підтримку JSON
app.use('/uploads', express.static('uploads')); // Статичні файли для папки uploads

// Налаштування для зберігання файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Директорія для завантаження
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Додати дату до імені
    },
});

const upload = multer({ storage: storage });

// Створення директорії uploads, якщо її немає
const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Функція для читання photos.json
const readPhotosJson = () => {
    if (fs.existsSync('photos.json')) {
        const data = fs.readFileSync('photos.json');
        return JSON.parse(data);
    }
    return [];
};

// Функція для запису photos.json
const writePhotosJson = (photos) => {
    fs.writeFileSync('photos.json', JSON.stringify(photos, null, 2));
};

// Обробка запиту на завантаження фото
app.post('/upload', upload.single('photo'), (req, res) => {
    const { description, price } = req.body;
    if (req.file) {
        // Зберігаємо інформацію про фото в photos.json
        const photos = readPhotosJson();
        const newPhoto = {
            name: req.file.filename,
            url: `http://localhost:${PORT}/uploads/${req.file.filename}`,
            description,
            price
        };
        photos.push(newPhoto);
        writePhotosJson(photos);
        
        res.status(200).json({ message: 'Фото успішно завантажено!', file: newPhoto });
    } else {
        res.status(400).json({ message: 'Не вдалося завантажити фото.' });
    }
});

// Отримання списку фото
app.get('/photos', (req, res) => {
    const photos = readPhotosJson();
    res.status(200).json(photos);
});

// Видалення фото
app.delete('/photos/:name', (req, res) => {
    const photoName = req.params.name;
    const filePath = path.join(dir, photoName);
    
    console.log('Спроба видалення:', filePath); // Лог для перевірки шляху до файлу

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('Файл не існує:', filePath);
            return res.status(404).json({ message: 'Файл не знайдено.' });
        }
        
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Помилка при видаленні:', err);
                return res.status(500).json({ message: 'Не вдалося видалити фото.' });
            }
            
            // Видаляємо фото з photos.json
            const photos = readPhotosJson().filter(photo => photo.name !== photoName);
            writePhotosJson(photos);
            
            res.status(200).json({ message: 'Фото успішно видалено.' });
        });
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
