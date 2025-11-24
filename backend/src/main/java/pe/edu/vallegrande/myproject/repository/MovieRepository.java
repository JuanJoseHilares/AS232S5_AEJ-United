package pe.edu.vallegrande.myproject.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import pe.edu.vallegrande.myproject.model.Movie;
import reactor.core.publisher.Mono;

public interface MovieRepository extends ReactiveMongoRepository<Movie, String> {
    Mono<Movie> findByName(String name);
}