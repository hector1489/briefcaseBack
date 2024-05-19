import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(cors())

const upload = multer({ dest: 'uploads/' })

app.post('/convert', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo')
  }

  const inputPath = req.file.path;
  const outputPath = path.join(__dirname, '..', 'uploads', `${req.file.filename}.pdf`)

  // Comando unoconv para convertir ODT a PDF
  exec(`unoconv -f pdf -o ${outputPath} ${inputPath}`, (error) => {
    if (error) {
      console.error('Error al convertir el archivo:', error);
      return res.status(500).send('Error al convertir el archivo')
    }

    // Enviar el archivo PDF como respuesta
    res.download(outputPath, (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err)
      }

      // Eliminar archivos temporales
      fs.unlink(inputPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error al eliminar el archivo ODT:', unlinkErr);
      })
      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) console.error('Error al eliminar el archivo PDF:', unlinkErr);
      })
    })
  })
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
})
