package pe.edu.vallegrande.myproject.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import pe.edu.vallegrande.myproject.model.Netflix;
import pe.edu.vallegrande.myproject.service.NetflixLanguageService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/v1/api/netflix/languages")
public class RestNetflixLanguage {

    private final NetflixLanguageService languageService;
    private final WebClient netflixWebClient;

    public RestNetflixLanguage(NetflixLanguageService languageService,
                               WebClient netflixWebClient) {
        this.languageService = languageService;
        this.netflixWebClient = netflixWebClient;
    }


    @GetMapping("/db/GetAll")
    public Flux<Netflix> getAllFromDb() {
        return languageService.findAll();
    }


    @PatchMapping("/db/changeStatus/{id}")
    public Mono<ResponseEntity<Map<String, String>>> changeStatus(@PathVariable String id,
                                                                  @RequestParam String status) {
        return languageService.findById(id)
                .flatMap(language -> {
                    language.setEstado(status.toUpperCase()); // "A" o "I"
                    return languageService.save(language)
                            .thenReturn(ResponseEntity.ok(Map.of("message", "Estado actualizado a " + status)));
                })
                .switchIfEmpty(Mono.just(ResponseEntity
                        .badRequest()
                        .body(Map.of("message", "No se encontró el idioma en MongoDB"))));
    }


    @GetMapping("/api")
    public Flux<Netflix> getFromApi() {
        return netflixWebClient.get()
                .uri("/languages")
                .retrieve()
                .bodyToFlux(Netflix.class);
    }


    @PutMapping("/db/update/{id}")
    public Mono<ResponseEntity<Object>> updateLanguage(@PathVariable String id, @RequestBody Netflix updatedData) {
        return netflixWebClient.get()
                .uri("/languages")
                .retrieve()
                .bodyToFlux(Netflix.class)
                .filter(apiLang -> apiLang.getCode().equalsIgnoreCase(updatedData.getCode()))
                .next()
                .flatMap(apiLang ->
                        languageService.findById(id)
                                .flatMap(existing -> {
                                    if (updatedData.getName() != null) existing.setName(updatedData.getName());
                                    if (updatedData.getNativeName() != null) existing.setNativeName(updatedData.getNativeName());
                                    if (updatedData.getRegion() != null) existing.setRegion(updatedData.getRegion());
                                    if (updatedData.getEstado() != null) existing.setEstado(updatedData.getEstado().toUpperCase());
                                    if (updatedData.getCode() != null) existing.setCode(updatedData.getCode());
                                    return languageService.save(existing)
                                            .map(saved -> ResponseEntity.ok((Object) saved));
                                })
                )
                .switchIfEmpty(Mono.just(ResponseEntity
                        .badRequest()
                        .body(Map.of("message",
                                "El idioma con código " + updatedData.getCode() + " no existe en la API."))));
    }


    @PostMapping("/db/save")
    public Mono<ResponseEntity<Object>> saveFromApi(@RequestBody Netflix newLanguage) {
        return netflixWebClient.get()
                .uri("/languages")
                .retrieve()
                .bodyToFlux(Netflix.class)
                .filter(apiLang -> apiLang.getCode().equalsIgnoreCase(newLanguage.getCode()))
                .next()
                .flatMap(apiLang -> {
                    newLanguage.setEstado("A");
                    if (newLanguage.getNativeName() == null) newLanguage.setNativeName("");
                    if (newLanguage.getRegion() == null) newLanguage.setRegion("");
                    return languageService.save(newLanguage)
                            .map(saved -> ResponseEntity.ok((Object) saved));
                })
                .switchIfEmpty(Mono.just(ResponseEntity
                        .badRequest()
                        .body(Map.of("message",
                                "El idioma con código " + newLanguage.getCode() + " no existe en la API."))));
    }
}