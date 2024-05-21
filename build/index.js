"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const upload = (0, multer_1.default)({ dest: 'uploads/' });
app.post('/convert', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo');
    }
    const inputPath = req.file.path;
    const outputPath = path_1.default.join(__dirname, 'uploads', `${req.file.filename}.pdf`);
    // Convertir ODT a PDF
    (0, child_process_1.exec)(`unoconv -f pdf -o ${outputPath} ${inputPath}`, (error) => {
        if (error) {
            console.error('Error al convertir el archivo:', error);
            fs_1.default.unlink(inputPath, (unlinkErr) => {
                if (unlinkErr)
                    console.error('Error al eliminar el archivo ODT:', unlinkErr);
            });
            return res.status(500).send('Error al convertir el archivo');
        }
        // Enviar el archivo PDF
        res.download(outputPath, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).send('Error al enviar el archivo');
            }
            // Eliminar temporales
            fs_1.default.unlink(inputPath, (unlinkErr) => {
                if (unlinkErr)
                    console.error('Error al eliminar el archivo ODT:', unlinkErr);
            });
            fs_1.default.unlink(outputPath, (unlinkErr) => {
                if (unlinkErr)
                    console.error('Error al eliminar el archivo PDF:', unlinkErr);
            });
        });
    });
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map