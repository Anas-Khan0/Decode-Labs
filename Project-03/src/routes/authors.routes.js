// REST -> SQL mapping for authors
//   POST   /api/authors      -> INSERT   (Create)
//   GET    /api/authors      -> SELECT   (Read all)
//   GET    /api/authors/:id  -> SELECT   (Read one)
//   PUT    /api/authors/:id  -> UPDATE   (Update full)
//   PATCH  /api/authors/:id  -> UPDATE   (Update partial)
//   DELETE /api/authors/:id  -> DELETE   (Delete)
import { Router } from 'express';
import {
  createAuthor,
  getAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} from '../controllers/authors.controller.js';

const router = Router();

router.post('/', createAuthor);
router.get('/', getAuthors);
router.get('/:id', getAuthorById);
router.put('/:id', updateAuthor);
router.patch('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);

export default router;
