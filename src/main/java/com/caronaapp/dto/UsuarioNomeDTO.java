package com.caronaapp.dto;

public class UsuarioNomeDTO {
    private Long id;
    private String nome;

    public UsuarioNomeDTO(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public UsuarioNomeDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
