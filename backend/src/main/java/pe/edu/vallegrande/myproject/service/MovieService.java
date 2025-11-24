package pe.edu.vallegrande.myproject.service;

import pe.edu.vallegrande.myproject.model.Movie;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public abstract class MovieService {
    public abstract Mono<Movie> findByName(String name);

    public abstract Flux<Movie> findAll();

    public abstract Mono<Movie> save(Movie movie);

    public abstract Mono<Movie> findById(String id);
}
