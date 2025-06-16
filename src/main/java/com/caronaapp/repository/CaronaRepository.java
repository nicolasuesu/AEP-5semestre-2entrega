package com.caronaapp.repository;

import com.caronaapp.model.Carona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CaronaRepository extends JpaRepository<Carona, Long> {
    List<Carona> findByOrigemContainingIgnoreCaseAndDestinoContainingIgnoreCaseAndDataHoraBetween(String origem, String destino, LocalDateTime dataInicio, LocalDateTime dataFim);
    List<Carona> findByOrigemContainingIgnoreCaseAndDataHoraBetween(String origem, LocalDateTime dataInicio, LocalDateTime dataFim);
    List<Carona> findByDestinoContainingIgnoreCaseAndDataHoraBetween(String destino, LocalDateTime dataInicio, LocalDateTime dataFim);
    List<Carona> findByDataHoraBetween(LocalDateTime dataInicio, LocalDateTime dataFim);
    List<Carona> findByMotoristaId(Long motoristaId);
}
