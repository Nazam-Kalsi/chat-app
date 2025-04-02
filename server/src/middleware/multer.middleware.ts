import multer from 'multer';
import path from 'path';


 const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images")
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = file.originalname.split('.')[0]+ '-' + new Date(Date.now()).toDateString().replace(/\s+/g, '-')+ new Date(Date.now()).toLocaleTimeString().replace(/[:\s]/g, '-') + ext; 
      cb(null, fileName)
    }
  })
  
  export const upload = multer({ storage })