package pe.edu.vallegrande.myproject.service;

import pe.edu.vallegrande.myproject.model.Netflix;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Optional;

public interface NetflixLanguageService {
    Flux<Netflix> findAll();
    Mono<Netflix> save(Netflix language);
    Mono<Netflix> findById(String id);
}
