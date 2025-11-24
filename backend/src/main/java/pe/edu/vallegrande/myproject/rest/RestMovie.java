package pe.edu.vallegrande.myproject.rest;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.myproject.model.Movie;
import pe.edu.vallegrande.myproject.model.MovieFullDTO;
import pe.edu.vallegrande.myproject.model.DisneyApiResponse;
import pe.edu.vallegrande.myproject.service.MovieService;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/RapidAPI")
public class RestMovie {

    private final MovieService movieService;
    private final WebClient webClient;

    public RestMovie(MovieService movieService,
                     @Qualifier("disneyWebClient") WebClient rapidApiWebClient) {
        this.movieService = movieService;
        this.webClient = rapidApiWebClient;
    }

    @GetMapping("/Disney/GetAll")
    public Flux<Map<String, Object>> getAllMovies() {
        return movieService.findAll()
                .map(movie -> {
                    Map<String, Object> map = new java.util.HashMap<>();
                    map.put("id", movie.getId());
                    map.put("name", movie.getName());
                    map.put("status", movie.getStatus() != null ? movie.getStatus() : "");
                    map.put("release_year",movie.getReleaseYear() != null ? movie.getReleaseYear():"");
                    map.put("type",movie.getType()!=null ? movie.getType():"");
                    map.put("description", movie.getDescription() != null ? movie.getDescription() : "");
                    return map;
                });
    }

    @GetMapping("/Disney/search/{name}")
    public Mono<Map<String, String>> getMovieByName(@PathVariable String name) {
        return movieService.findByName(name)
                .map(movie -> Map.of(
                        "id", movie.getId(),
                        "name", movie.getName()
                ))
                .switchIfEmpty(Mono.just(Map.of("message", "No se encontró la película en MongoDB")));
    }


    // Guardar nueva película
    @PostMapping("/Disney/save")
    public Mono<ResponseEntity<Object>> createMovie(@RequestBody Movie movie) {
        if (movie.getName() == null || movie.getName().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest()
                    .body((Object) Map.of("message", "Debe proporcionar un título de película")));
        }
        if (movie.getDescription() == null || movie.getDescription().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest()
                    .body((Object) Map.of("message", "Debe proporcionar una descripción")));
        }

        return movieService.findByName(movie.getName())
                .flatMap(existing -> Mono.just(ResponseEntity.badRequest()
                        .body((Object) Map.of("message", "La película ya existe en la base de datos"))
                ))
                .switchIfEmpty(
                        getMoviesFromAPI(movie.getName())
                                .next()
                                .flatMap(apiData -> {
                                    movie.setStatus("A");
                                    return movieService.save(movie)
                                            .map(saved -> ResponseEntity.ok((Object) saved));
                                })
                                .switchIfEmpty(Mono.just(
                                        ResponseEntity.badRequest()
                                                .body((Object) Map.of("message", "El título no existe en la API de Disney"))
                                ))
                );
    }

    @PatchMapping("/Disney/Mongo/changeStatus/{id}")
    public Mono<ResponseEntity<Map<String, String>>> changeMovieStatus(
            @PathVariable String id,
            @RequestParam String status) {

        if (!status.equals("A") && !status.equals("I")) {
            return Mono.just(ResponseEntity.badRequest()
                    .body(Map.of("message", "El estado debe ser 'A' (activo) o 'I' (inactivo)")));
        }

        return movieService.findById(id)
                .flatMap(movie -> {
                    movie.setStatus(status);
                    return movieService.save(movie)
                            .map(updated -> ResponseEntity.ok(Map.of(
                                    "id", updated.getId(),
                                    "name", updated.getName(),
                                    "status", updated.getStatus()
                            )));
                })
                .switchIfEmpty(Mono.just(
                        ResponseEntity.badRequest()
                                .body(Map.of("message", "La película con id " + id + " no existe"))
                ));
    }

    @GetMapping("/Disney/API/searchFull/{name}")
    public Mono<Object> getMovieFullByName(@PathVariable String name) {
        return getMoviesFromAPI(name)
                .collectList()
                .flatMap(list -> list.isEmpty()
                        ? Mono.just(Map.of("message", "No se encontró la película en la API de Disney"))
                        : Mono.just(list)
                );
    }

    @PutMapping("/Disney/Mongo/update")
    public Mono<ResponseEntity<Object>> updateMovie(@RequestBody Movie movie) {
        return movieService.findByName(movie.getOldName())
                .flatMap(existingMovie -> {
                    if (movie.getName() == null || movie.getName().isEmpty()) {
                        return Mono.just(ResponseEntity.badRequest()
                                .body((Object) Map.of("message", "Debe proporcionar un nuevo nombre para actualizar")));
                    }

                    // Verificar en la API de Disney
                    return getMoviesFromAPI(movie.getName())
                            .next()
                            .flatMap(apiData -> {
                                existingMovie.setName(movie.getName());
                                existingMovie.setDescription(movie.getDescription());
                                return movieService.save(existingMovie)
                                        .map(updated -> ResponseEntity.ok((Object) updated));
                            })
                            .switchIfEmpty(Mono.just(
                                    ResponseEntity.badRequest()
                                            .body((Object) Map.of("message", "El nombre proporcionado no existe en la API de Disney"))
                            ));
                })
                .switchIfEmpty(Mono.just(
                        ResponseEntity.badRequest()
                                .body((Object) Map.of("message", "La película no existe en la base de datos"))
                ));
    }

    private Flux<MovieFullDTO> getMoviesFromAPI(String name) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/v1/disney-plus-top")
                        .queryParam("name", name)
                        .build())
                .retrieve()
                .bodyToMono(DisneyApiResponse.class)
                .flatMapMany(resp -> {
                    if (resp.getItems() != null && !resp.getItems().isEmpty()) {
                        return Flux.fromIterable(resp.getItems())
                                .map(item -> {
                                    MovieFullDTO dto = new MovieFullDTO();
                                    dto.setName(item.getTitle());
                                    dto.setDescription(item.getDescription());
                                    dto.setRelease_year(item.getRelease_year());
                                    dto.setRuntime(item.getRuntime());
                                    dto.setGenres(item.getGenres().toArray(new String[0]));
                                    dto.setProduction_countries(item.getProduction_countries().toArray(new String[0]));
                                    return dto;
                                });
                    }
                    return Flux.empty();
                })
                .onErrorResume(e -> Flux.empty());
    }
}
