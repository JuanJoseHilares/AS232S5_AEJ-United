package pe.edu.vallegrande.myproject.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${rapidapi.disney.url}")
    private String disneyUrl;

    @Value("${rapidapi.disney.host}")
    private String disneyHost;

    @Value("${rapidapi.disney.apikey}")
    private String disneyApiKey;

    @Value("${rapidapi.netflix.url}")
    private String netflixUrl;

    @Value("${rapidapi.netflix.host}")
    private String netflixHost;

    @Value("${rapidapi.netflix.apikey}")
    private String netflixApiKey;

    @Bean(name = "disneyWebClient")
    public WebClient disneyWebClient() {
        return WebClient.builder()
                .baseUrl(disneyUrl)
                .defaultHeader("x-rapidapi-key", disneyApiKey)
                .defaultHeader("x-rapidapi-host", disneyHost)
                .build();
    }

    @Bean(name = "netflixWebClient")
    public WebClient netflixWebClient() {
        return WebClient.builder()
                .baseUrl(netflixUrl)
                .defaultHeader("x-rapidapi-key", netflixApiKey)
                .defaultHeader("x-rapidapi-host", netflixHost)
                .build();
    }
}