package com.caronaapp.repository;

import com.caronaapp.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByPassageiroId(Long passageiroId);
    List<Reserva> findByCaronaId(Long caronaId); 
    boolean existsByCaronaIdAndPassageiroId(Long caronaId, Long passageiroId); 
}
