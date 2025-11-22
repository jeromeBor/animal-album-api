const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'upload')
    // req.file.path
  },
  filename(req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extension = file.originalname.split('.').pop()
    cb(null, `${uniquePrefix}.${extension}`)
  },
})

// Configuration de Multer (définir le storage, les limites, etc.)
const upload = multer({
  // ... votre configuration de storage
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
})

// Le middleware prêt à être utilisé.
const imageUpload = upload.single('imageFile') // 👈 'imageFile' est le nom du champ de fichier attendu
module.exports = {
  imageUpload,
}
