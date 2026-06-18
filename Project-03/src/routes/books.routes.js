// REST -> SQL mapping for books
//   POST   /api/books      -> INSERT   (Create)
//   GET    /api/books      -> SELECT   (Read all)
//   GET    /api/books/:id  -> SELECT   (Read one)
//   PUT    /api/books/:id  -> UPDATE   (Update full)
//   PATCH  /api/books/:id  -> UPDATE   (Update partial)
//   DELETE /api/books/:id  -> DELETE   (Delete)
import { Router } from 'express';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/books.controller.js';

const router = Router();

router.post('/', createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.patch('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
