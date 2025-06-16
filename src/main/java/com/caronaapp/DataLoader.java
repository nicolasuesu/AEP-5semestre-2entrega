package com.caronaapp;

import com.caronaapp.model.Carona;
import com.caronaapp.model.Usuario;
import com.caronaapp.repository.CaronaRepository;
import com.caronaapp.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CaronaRepository caronaRepository;

    public DataLoader(UsuarioRepository usuarioRepository, CaronaRepository caronaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.caronaRepository = caronaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        Usuario motorista1 = new Usuario();
        motorista1.setNome("Carlos Silva");
        motorista1.setEmail("carlos@example.com");
        motorista1.setSenha("senha123"); 
        motorista1.setTelefone("99999-0001");
        usuarioRepository.save(motorista1);

        Usuario motorista2 = new Usuario();
        motorista2.setNome("Ana Pereira");
        motorista2.setEmail("ana@example.com");
        motorista2.setSenha("senha456");
        motorista2.setTelefone("99999-0002");
        usuarioRepository.save(motorista2);
        
        Usuario passageiroTeste;
        if (!usuarioRepository.existsById(1L)) {
            passageiroTeste = new Usuario();
            passageiroTeste.setNome("Passageiro Teste ID1");
            passageiroTeste.setEmail("passageiro1@example.com");
            passageiroTeste.setSenha("senha789");
            passageiroTeste.setTelefone("99999-0003");
            usuarioRepository.save(passageiroTeste);
        } else {
            passageiroTeste = usuarioRepository.findById(1L).orElse(null);
            if (passageiroTeste == null) {
                passageiroTeste = new Usuario();
                passageiroTeste.setNome("Passageiro Teste Fallback");
                passageiroTeste.setEmail("passageiro_fallback@example.com");
                passageiroTeste.setSenha("senha_fallback");
                usuarioRepository.save(passageiroTeste);
            }
        }

        Carona carona1 = new Carona();
        carona1.setOrigem("Unicesumar");
        carona1.setDestino("Shopping Avenida Center");
        carona1.setDataHora(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0));
        carona1.setVagasDisponiveis(3);
        carona1.setMotorista(motorista1);
        carona1.setNotas("Carro confortável, com ar.");
        caronaRepository.save(carona1);

        Carona carona2 = new Carona();
        carona2.setOrigem("Centro");
        carona2.setDestino("Unicesumar");
        carona2.setDataHora(LocalDateTime.now().plusDays(2).withHour(18).withMinute(30).withSecond(0).withNano(0));
        carona2.setVagasDisponiveis(2);
        carona2.setMotorista(motorista2);
        caronaRepository.save(carona2);
        
        Carona carona3 = new Carona();
        carona3.setOrigem("Rodoviária");
        carona3.setDestino("Aeroporto");
        carona3.setDataHora(LocalDateTime.now().plusHours(5).withMinute(0).withSecond(0).withNano(0));
        carona3.setVagasDisponiveis(1);
        carona3.setMotorista(motorista1);
        carona3.setNotas("Apenas uma mala pequena.");
        caronaRepository.save(carona3);

        Carona carona4 = new Carona();
        carona4.setOrigem("Shopping Catuaí");
        carona4.setDestino("Unicesumar");
        carona4.setDataHora(LocalDateTime.now().plusDays(3).withHour(13).withMinute(0).withSecond(0).withNano(0));
        carona4.setVagasDisponiveis(4);
        carona4.setMotorista(motorista2);
        carona4.setNotas("Levo até 2 passageiros no banco de trás para maior conforto.");
        caronaRepository.save(carona4);

        Carona carona5 = new Carona();
        carona5.setOrigem("Aeroporto");
        carona5.setDestino("Centro");
        carona5.setDataHora(LocalDateTime.now().plusDays(1).withHour(22).withMinute(0).withSecond(0).withNano(0));
        carona5.setVagasDisponiveis(2);
        carona5.setMotorista(motorista1); 
        carona5.setNotas("Viagem noturna tranquila.");
        caronaRepository.save(carona5);

        Carona carona6 = new Carona();
        carona6.setOrigem("Unicesumar");
        carona6.setDestino("Centro");
        carona6.setDataHora(LocalDateTime.now().plusDays(1).withHour(17).withMinute(0).withSecond(0).withNano(0));
        carona6.setVagasDisponiveis(0); 
        carona6.setMotorista(motorista2);
        carona6.setNotas("Carona lotada para teste.");
        caronaRepository.save(carona6);
    }
}
