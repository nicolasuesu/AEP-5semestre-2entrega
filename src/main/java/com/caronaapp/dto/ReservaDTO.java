package com.caronaapp.dto;

import java.time.LocalDateTime;

public class ReservaDTO {
    private Long id;
    private CaronaSearchResultDTO carona;
    private LocalDateTime dataHoraReserva;

    public ReservaDTO() {
    }

    public ReservaDTO(Long id, CaronaSearchResultDTO carona, LocalDateTime dataHoraReserva) {
        this.id = id;
        this.carona = carona;
        this.dataHoraReserva = dataHoraReserva;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CaronaSearchResultDTO getCarona() {
        return carona;
    }

    public void setCarona(CaronaSearchResultDTO carona) {
        this.carona = carona;
    }

    public LocalDateTime getDataHoraReserva() {
        return dataHoraReserva;
    }

    public void setDataHoraReserva(LocalDateTime dataHoraReserva) {
        this.dataHoraReserva = dataHoraReserva;
    }
}
