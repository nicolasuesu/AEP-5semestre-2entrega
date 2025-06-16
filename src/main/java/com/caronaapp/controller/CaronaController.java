package com.caronaapp.controller;

import com.caronaapp.dto.CaronaSearchResultDTO;
import com.caronaapp.dto.ReservaDTO;
import com.caronaapp.model.Carona;
import com.caronaapp.service.CaronaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/api/caronas")
@CrossOrigin(origins = "*")
public class CaronaController {

    @Autowired
    private CaronaService caronaService;

    @GetMapping("/buscar")
    public ResponseEntity<List<CaronaSearchResultDTO>> buscarCaronas(@RequestParam(required = false) String origem, @RequestParam(required = false) String destino, @RequestParam(required = false) String data) {
        List<CaronaSearchResultDTO> caronasDTO = caronaService.buscarCaronasDisponiveis(origem, destino, data);
        if (caronasDTO.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(caronasDTO);
    }

    @PostMapping
    public ResponseEntity<Carona> oferecerCarona(@RequestBody Carona carona) {
        Carona novaCarona = caronaService.oferecerCarona(carona);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCarona);
    }

    @PostMapping("/{caronaId}/reservar")
    public ResponseEntity<?> reservarVaga(@PathVariable Long caronaId, @RequestParam Long passageiroId) {
        try {
            ReservaDTO reservaDTO = caronaService.reservarVaga(caronaId, passageiroId);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservaDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/minhas-reservas")
    public ResponseEntity<List<ReservaDTO>> getMinhasReservas(@RequestParam Long passageiroId) {
        List<ReservaDTO> reservasDTO = caronaService.getMinhasReservas(passageiroId);
        if (reservasDTO.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reservasDTO);
    }

    @GetMapping("/minhas-oferecidas")
    public ResponseEntity<List<CaronaSearchResultDTO>> getMinhasCaronasOferecidas(@RequestParam Long motoristaId) {
        List<CaronaSearchResultDTO> caronasDTO = caronaService.getMinhasCaronasOferecidas(motoristaId);
        if (caronasDTO.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(caronasDTO);
    }
}
