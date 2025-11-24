package pe.edu.vallegrande.myproject.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import pe.edu.vallegrande.myproject.model.Netflix;
import reactor.core.publisher.Mono;

@Repository
public interface NetflixLanguageRepository extends ReactiveMongoRepository<Netflix, String> {
}
