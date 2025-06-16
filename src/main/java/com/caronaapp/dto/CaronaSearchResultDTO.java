package com.caronaapp.dto;

import java.time.LocalDateTime;

public class CaronaSearchResultDTO {
    private Long id;
    private String origem;
    private String destino;
    private LocalDateTime dataHora;
    private int vagasDisponiveis;
    private String notas;
    private UsuarioNomeDTO motorista;
    private boolean reservadaPeloUsuarioAtual;

    public CaronaSearchResultDTO(Long id, String origem, String destino, LocalDateTime dataHora,
                                 int vagasDisponiveis, String notas, UsuarioNomeDTO motorista, boolean reservadaPeloUsuarioAtual) {
        this.id = id;
        this.origem = origem;
        this.destino = destino;
        this.dataHora = dataHora;
        this.vagasDisponiveis = vagasDisponiveis;
        this.notas = notas;
        this.motorista = motorista;
        this.reservadaPeloUsuarioAtual = reservadaPeloUsuarioAtual;
    }

    public CaronaSearchResultDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrigem() { return origem; }
    public void setOrigem(String origem) { this.origem = origem; }

    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public int getVagasDisponiveis() { return vagasDisponiveis; }
    public void setVagasDisponiveis(int vagasDisponiveis) { this.vagasDisponiveis = vagasDisponiveis; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public UsuarioNomeDTO getMotorista() { return motorista; }
    public void setMotorista(UsuarioNomeDTO motorista) { this.motorista = motorista; }

    public boolean isReservadaPeloUsuarioAtual() {
        return reservadaPeloUsuarioAtual;
    }

    public void setReservadaPeloUsuarioAtual(boolean reservadaPeloUsuarioAtual) {
        this.reservadaPeloUsuarioAtual = reservadaPeloUsuarioAtual;
    }
}
