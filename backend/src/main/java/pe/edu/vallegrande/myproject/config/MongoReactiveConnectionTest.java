package pe.edu.vallegrande.myproject.config;

import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoDatabase;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class MongoReactiveConnectionTest implements CommandLineRunner {

    private final MongoClient mongoClient;

    public MongoReactiveConnectionTest(MongoClient mongoClient) {
        this.mongoClient = mongoClient;
    }

    @Override
    public void run(String... args) {
        try {
            MongoDatabase db = mongoClient.getDatabase("RapiAPI"); // usa el nombre de tu DB en Atlas/local

            System.out.println("Buscando colecciones en la base de datos: " + db.getName());

            // Listamos TODAS las colecciones
            Flux.from(db.listCollectionNames()).collectList().subscribe(
                    collections -> {
                        if (collections.isEmpty()) {
                            System.out.println("No se encontraron colecciones en la base de datos.");
                        } else {
                            System.out.println("Colecciones encontradas en MongoDB:");
                            collections.forEach(name -> System.out.println("   - " + name));
                        }
                    },
                    error -> System.err.println("Error al conectar a MongoDB: " + error.getMessage()),
                    () -> System.out.println("Conexión verificada a MongoDB: " + db.getName())
            );

        } catch (Exception e) {
            System.err.println("Error al inicializar conexión: " + e.getMessage());
        }
    }
}