package pe.edu.vallegrande.myproject.model;

import lombok.Data;

import lombok.Data;

@Data
public class MovieFullDTO {
    private String id;
    private String name;
    private String description;
    private Integer release_year;
    private Integer runtime;
    private String[] genres;
    private String[] production_countries;

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Integer getRelease_year() { return release_year; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setRelease_year(Integer release_year) { this.release_year = release_year; }
    public void setRuntime(Integer runtime) { this.runtime = runtime; }
    public void setGenres(String[] genres) { this.genres = genres; }
    public void setProduction_countries(String[] production_countries) { this.production_countries = production_countries; }
}