package pe.edu.vallegrande.myproject.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "netflix")
public class Netflix {

    @Id
    private String id;
    private String code;
    private String name;
    private String estado;
    private String nativeName;
    private String region;

    public Netflix() {}

    public Netflix(String code, String name) {
        this.code = code;
        this.name = name;
        this.estado = "A"; // por defecto activo
    }

    // --- Getters & Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getNativeName() { return nativeName; }
    public void setNativeName(String nativeName) { this.nativeName = nativeName; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
}