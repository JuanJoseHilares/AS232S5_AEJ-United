package pe.edu.vallegrande.myproject.service.impl;

import org.springframework.beans.factory.annotation.Autowired;  // Opcional, pero recomendado para claridad
import org.springframework.stereotype.Service;
import pe.edu.vallegrande.myproject.model.Movie;
import pe.edu.vallegrande.myproject.repository.MovieRepository;
import pe.edu.vallegrande.myproject.service.MovieService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class MovieServiceImpl extends MovieService {

    private final MovieRepository movieRepository;

    @Autowired
    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public Mono<Movie> findByName(String name) {
        return movieRepository.findByName(name);
    }

    @Override
    public Flux<Movie> findAll() {
        return movieRepository.findAll();
    }

    @Override
    public Mono<Movie> save(Movie movie) {
        return movieRepository.save(movie);
    }

    @Override
    public Mono<Movie> findById(String id) {
        return movieRepository.findById(id);
    }
}