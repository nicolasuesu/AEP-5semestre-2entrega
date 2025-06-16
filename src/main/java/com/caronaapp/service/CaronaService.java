package com.caronaapp.service;

import com.caronaapp.dto.CaronaSearchResultDTO;
import com.caronaapp.dto.ReservaDTO;
import com.caronaapp.dto.UsuarioNomeDTO;
import com.caronaapp.model.Carona;
import com.caronaapp.model.Reserva;
import com.caronaapp.model.Usuario;
import com.caronaapp.repository.CaronaRepository;
import com.caronaapp.repository.ReservaRepository;
import com.caronaapp.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaronaService {

    private static final Logger logger = LoggerFactory.getLogger(CaronaService.class);

    @Autowired
    private CaronaRepository caronaRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private static final Long USUARIO_ATUAL_ID = 1L;

    public List<CaronaSearchResultDTO> buscarCaronasDisponiveis(String origem, String destino, String data) {
        LocalDateTime dataInicio;
        LocalDateTime dataFim;

        if (data != null && !data.trim().isEmpty()) {
            java.time.LocalDate localDate = java.time.LocalDate.parse(data);
            dataInicio = localDate.atStartOfDay();
            dataFim = localDate.atTime(23, 59, 59, 999999999);
        } else {
            dataInicio = LocalDateTime.now();
            dataFim = LocalDateTime.of(9999, 12, 31, 23, 59, 59);
        }

        boolean origemVazia = (origem == null || origem.trim().isEmpty());
        boolean destinoVazio = (destino == null || destino.trim().isEmpty());
        boolean dataVazia = (data == null || data.trim().isEmpty());

        List<Carona> caronas;

        if (!dataVazia) {
            java.time.LocalDate localDate = java.time.LocalDate.parse(data);
            dataInicio = localDate.atStartOfDay();
            dataFim = localDate.atTime(23, 59, 59, 999999999);

            if (origemVazia && destinoVazio) {
                caronas = caronaRepository.findByDataHoraBetween(dataInicio, dataFim);
            } else if (origemVazia) {
                caronas = caronaRepository.findByDestinoContainingIgnoreCaseAndDataHoraBetween(destino, dataInicio, dataFim);
            } else if (destinoVazio) {
                caronas = caronaRepository.findByOrigemContainingIgnoreCaseAndDataHoraBetween(origem, dataInicio, dataFim);
            } else {
                caronas = caronaRepository.findByOrigemContainingIgnoreCaseAndDestinoContainingIgnoreCaseAndDataHoraBetween(origem, destino, dataInicio, dataFim);
            }
        } else {
            LocalDateTime searchStartDate = LocalDateTime.now();
            LocalDateTime searchEndDate = LocalDateTime.of(9999,12,31,23,59,59);

            if (origemVazia && destinoVazio) {
                caronas = caronaRepository.findByDataHoraBetween(searchStartDate, searchEndDate);
            } else if (origemVazia) {
                caronas = caronaRepository.findByDestinoContainingIgnoreCaseAndDataHoraBetween(destino, searchStartDate, searchEndDate);
            } else if (destinoVazio) {
                caronas = caronaRepository.findByOrigemContainingIgnoreCaseAndDataHoraBetween(origem, searchStartDate, searchEndDate);
            } else {
                caronas = caronaRepository.findByOrigemContainingIgnoreCaseAndDestinoContainingIgnoreCaseAndDataHoraBetween(origem, destino, searchStartDate, searchEndDate);
            }
        }

        return caronas.stream()
                .map(carona -> convertToCaronaSearchResultDTO(carona, USUARIO_ATUAL_ID))
                .collect(Collectors.toList());
    }

    public Carona oferecerCarona(Carona carona) {
        return caronaRepository.save(carona);
    }

    @Transactional
    public ReservaDTO reservarVaga(Long caronaId, Long passageiroId) {
        Carona carona = caronaRepository.findById(caronaId)
                .orElseThrow(() -> new EntityNotFoundException("Carona não encontrada com ID: " + caronaId));
        Usuario passageiro = usuarioRepository.findById(passageiroId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + passageiroId));

        if (carona.getVagasDisponiveis() <= 0) {
            throw new IllegalStateException("Não há vagas disponíveis nesta carona.");
        }

        carona.setVagasDisponiveis(carona.getVagasDisponiveis() - 1);
        caronaRepository.save(carona);

        Reserva reserva = new Reserva(carona, passageiro);
        Reserva savedReserva = reservaRepository.save(reserva);
        logger.info("Reserva salva com ID: {} para Passageiro ID: {} e Carona ID: {}", savedReserva.getId(), passageiro.getId(), carona.getId());
        return convertToReservaDTO(savedReserva);
    }

    @Transactional(readOnly = true)
    public List<ReservaDTO> getMinhasReservas(Long passageiroId) {
        logger.info("Buscando reservas para Passageiro ID: {}", passageiroId);
        List<Reserva> reservas = reservaRepository.findByPassageiroId(passageiroId);
        logger.info("Encontradas {} reservas para Passageiro ID: {}", reservas.size(), passageiroId);
        return reservas.stream()
                .map(this::convertToReservaDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CaronaSearchResultDTO> getMinhasCaronasOferecidas(Long motoristaId) {
        logger.info("Buscando caronas oferecidas pelo Motorista ID: {}", motoristaId);
        List<Carona> caronas = caronaRepository.findByMotoristaId(motoristaId);
        logger.info("Encontradas {} caronas oferecidas pelo Motorista ID: {}", caronas.size(), motoristaId);
        return caronas.stream()
                .map(carona -> convertToCaronaSearchResultDTO(carona, motoristaId))
                .collect(Collectors.toList());
    }

    private CaronaSearchResultDTO convertToCaronaSearchResultDTO(Carona carona, Long usuarioAtualId) {
        UsuarioNomeDTO motoristaDTO = null;
        if (carona.getMotorista() != null) {
            motoristaDTO = new UsuarioNomeDTO(carona.getMotorista().getId(), carona.getMotorista().getNome());
        }
        boolean reservadaPeloUsuarioAtual = reservaRepository.existsByCaronaIdAndPassageiroId(carona.getId(), usuarioAtualId);
        return new CaronaSearchResultDTO(
                carona.getId(),
                carona.getOrigem(),
                carona.getDestino(),
                carona.getDataHora(),
                carona.getVagasDisponiveis(),
                carona.getNotas(),
                motoristaDTO,
                reservadaPeloUsuarioAtual
        );
    }

    private ReservaDTO convertToReservaDTO(Reserva reserva) {
        CaronaSearchResultDTO caronaDTO = convertToCaronaSearchResultDTO(reserva.getCarona(), reserva.getPassageiro().getId());
        return new ReservaDTO(
                reserva.getId(),
                caronaDTO,
                reserva.getDataHoraReserva()
        );
    }
}
