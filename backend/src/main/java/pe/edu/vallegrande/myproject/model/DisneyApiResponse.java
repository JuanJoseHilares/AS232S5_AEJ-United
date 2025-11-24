package pe.edu.vallegrande.myproject.model;

import java.util.List;

public class DisneyApiResponse {
    private List<DisneyItem> items;

    public List<DisneyItem> getItems() {
        return items;
    }

    public void setItems(List<DisneyItem> items) {
        this.items = items;
    }

    public static class DisneyItem {
        private String title;
        private String description;
        private Integer release_year;
        private Integer runtime;
        private List<String> genres;
        private List<String> production_countries;

        // Getters y setters manuales
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Integer getRelease_year() { return release_year; }
        public void setRelease_year(Integer release_year) { this.release_year = release_year; }

        public Integer getRuntime() { return runtime; }
        public void setRuntime(Integer runtime) { this.runtime = runtime; }

        public List<String> getGenres() { return genres; }
        public void setGenres(List<String> genres) { this.genres = genres; }

        public List<String> getProduction_countries() { return production_countries; }
        public void setProduction_countries(List<String> production_countries) { this.production_countries = production_countries; }
    }
}