const express = require('express');
const cors = require('cors');
const prisma = require('../prismaClient');
const router = express.Router();

router.use(cors());
router.use(express.json());

router.get('/movieslist', async (req, res) => {
  console.log('Received request for /movieslist');
  try {
    const allMovies = await prisma.movie.findMany();

    res.json({
      message: 'Successfully retrieved all movies',
      data: allMovies,
    });
  } catch{
    res.json({
      message: 'Error retrieving movies',
    });
  }
});

router.post('/movieslist/add', async (req, res) => {

    const { title, directorId } = req.body;
    try{
    const existingDirector = await prisma.director.findUnique({
      where: {
        id: parseInt(directorId),
      },
    });
    if (!existingDirector) {
      res.json({
        message: 'Director not found',
      });
    }
    else{
    const createdMovie = await prisma.movie.create({
      data: {
        title : title,
        directorId : parseInt(directorId),
      },
      include:{
        director:true
      }
    });

    res.json({
      message: 'Successfully added movie',
      data: createdMovie,
    });
  }
  }
  catch {
   res.json({
    message:'Error adding movie'
   })
  }
});


router.delete('/movieslist/delete/:id', async (req, res) => {
  const movieId = parseInt(req.params.id);

  try {
    const existingMovie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!existingMovie) {
      res.json({
        message: 'Movie not found',
      });
    }
    else {
    await prisma.movie.delete({
      where: {
        id: movieId,
      },
    });

    res.json({
      message: 'Successfully deleted movie',
      data: existingMovie,
    });
  }
  } catch {
    res.json({
      message: 'Error deleting movie',
    });
  }
});

router.get('/movieslist/:id', async (req, res) => {
  const movieId = parseInt(req.params.id);

  try {
    const foundMovie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
      include:{
        director:true
      }
    });

    if (!foundMovie) {
      res.json({
        message: 'Movie not found',
      });
    }
    else{
    res.json({
      message: 'Successfully retrieved movie',
      data: foundMovie,
    });
  }
  } catch {
    res.json({
      message: 'Error retrieving movie',
    });
  }
});

router.put('/movieslist/update/:id', async (req, res) => {
  const movieId = parseInt(req.params.id);
  const { title, genre } = req.body;

  try {
    const existingMovie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!existingMovie) {
      return res.status(404).json({
        message: 'Movie not found',
      });
    }
    else{
    const updatedMovie = await prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        title: title || existingMovie.title, 
        genre: genre || existingMovie.genre, 
      },
    });

    res.json({
      message: 'Successfully updated movie',
      data: updatedMovie,
    });
  }
  } catch (e) {
    console.error('Error updating movie:', e);
    res.json({
      message: 'Error updating movie',
    });
  }
});
module.exports = router;


