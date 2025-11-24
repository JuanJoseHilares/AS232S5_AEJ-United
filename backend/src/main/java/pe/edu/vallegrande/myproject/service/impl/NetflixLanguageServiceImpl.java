package pe.edu.vallegrande.myproject.service.impl;

import org.springframework.stereotype.Service;
import pe.edu.vallegrande.myproject.model.Netflix;
import pe.edu.vallegrande.myproject.repository.NetflixLanguageRepository;
import pe.edu.vallegrande.myproject.service.NetflixLanguageService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class NetflixLanguageServiceImpl implements NetflixLanguageService {

    private final NetflixLanguageRepository repository;

    public NetflixLanguageServiceImpl(NetflixLanguageRepository repository) {
        this.repository = repository;
    }

    @Override
    public Flux<Netflix> findAll() {
        return repository.findAll();
    }

    @Override
    public Mono<Netflix> save(Netflix language) {
        return repository.save(language);
    }

    @Override
    public Mono<Netflix> findById(String id) {
        return repository.findById(id);
    }
}
