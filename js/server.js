const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування CORS
app.use(cors());
app.use(express.json());

// Налаштування статичних файлів
app.use('/uploads', express.static(path.join(__dirname, 'js/uploads')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Додайте цей рядок для обслуговування статичних файлів з кореневої директорії
app.use(express.static(__dirname));

// Налаштування для зберігання файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'js/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Створення директорії uploads, якщо її немає
const dir = path.join(__dirname, 'js/uploads');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

// Функція для читання photos.json
const readPhotosJson = () => {
    const filePath = path.join(__dirname, 'js/photos.json');
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath);
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Помилка читання photos.json:', error);
    }
    return [];
};

// Функція для запису photos.json
const writePhotosJson = (photos) => {
    const filePath = path.join(__dirname, 'js/photos.json');
    try {
        fs.writeFileSync(filePath, JSON.stringify(photos, null, 2));
    } catch (error) {
        console.error('Помилка запису photos.json:', error);
    }
};

// Маршрути для відображення HTML-сторінок
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Обробка запиту на завантаження фото
app.post('/upload', upload.single('photo'), (req, res) => {
    const { description, decorName, price } = req.body;
    if (req.file) {
        const photos = readPhotosJson();
        const newPhoto = {
            name: req.file.filename,
            url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
            description: description || 'Опис відсутній',
            decorName: decorName || 'Назва декору відсутня',
            price: price ? parseFloat(price) : 0
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
    
    console.log('Спроба видалення:', filePath);

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
