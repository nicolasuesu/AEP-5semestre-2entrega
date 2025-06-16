# Carona App

## Descrição

O Carona App é uma plataforma de caronas solidárias que conecta motoristas com vagas disponíveis a passageiros que buscam uma carona para o mesmo destino. O projeto visa facilitar o compartilhamento de viagens, tornando o transporte mais econômico e sustentável.

## Funcionalidades

*   **Buscar Caronas:** Usuários podem pesquisar caronas disponíveis com base na origem, destino e data. A busca suporta correspondência parcial para origem/destino e busca apenas por data.
*   **Oferecer Caronas:** Motoristas podem cadastrar suas viagens, especificando origem, destino, data, horário, vagas disponíveis e valor.
*   **Reservar Caronas:** Passageiros podem reservar vagas em caronas disponíveis. O sistema impede reservas em caronas lotadas ou já reservadas pelo mesmo usuário.
*   **Minhas Caronas:** Usuários podem visualizar as caronas que ofereceram e as caronas que reservaram.
*   **Interface Amigável:** Frontend desenvolvido em HTML, CSS e JavaScript para interação com o backend.
*   **Backend Robusto:** API RESTful desenvolvida com Spring Boot (Java) para gerenciar dados e lógica de negócios.
*   **Persistência de Dados:** Utiliza o banco de dados em memória H2 para armazenamento de informações sobre usuários, caronas e reservas.

## Tecnologias Utilizadas

*   **Backend:**
    *   Java 17+
    *   Spring Boot 3.x
    *   Spring Data JPA
    *   Spring Web
    *   H2 Database
    *   Maven (Gerenciador de Dependências)
*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (Vanilla JS com Fetch API)

## Estrutura do Projeto

```
.
├── pom.xml                 # Arquivo de configuração do Maven
├── README.md               # Este arquivo
├── frontend/               # Arquivos do frontend (versão inicial, não integrada)
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── caronaapp/
    │   │           ├── CaronaAppApplication.java  # Classe principal da aplicação Spring Boot
    │   │           ├── DataLoader.java            # Carrega dados iniciais para teste
    │   │           ├── controller/                # Controladores REST
    │   │           │   └── CaronaController.java
    │   │           ├── dto/                       # Data Transfer Objects
    │   │           │   ├── CaronaSearchResultDTO.java
    │   │           │   ├── ReservaDTO.java
    │   │           │   └── UsuarioNomeDTO.java
    │   │           ├── model/                     # Entidades JPA
    │   │           │   ├── Carona.java
    │   │           │   ├── Reserva.java
    │   │           │   └── Usuario.java
    │   │           ├── repository/                # Repositórios Spring Data JPA
    │   │           │   ├── CaronaRepository.java
    │   │           │   ├── ReservaRepository.java
    │   │           │   └── UsuarioRepository.java
    │   │           └── service/                   # Lógica de negócios
    │   │               └── CaronaService.java
    │   └── resources/
    │       ├── static/                            # Arquivos estáticos do frontend (integrado)
    │       │   ├── futuro.html                  # Página de funcionalidades futuras (exemplo)
    │       │   ├── index.html                   # Página principal da aplicação
    │       │   ├── script.js                    # Lógica do frontend
    │       │   └── styles.css                   # Estilização da página
    │       └── application.properties           # Configurações da aplicação (ex: H2 console)
    └── test/                                    # Testes (a serem implementados)
```

## Configuração e Execução

### Pré-requisitos

*   JDK 17 ou superior instalado e configurado.
*   Apache Maven instalado e configurado.
*   Um editor de código ou IDE de sua preferência (ex: IntelliJ IDEA, VS Code com extensões Java).

### Passos para Executar

1.  **Clone o repositório:**
    ```bash
    git clone (https://github.com/nicolasuesu/AEP-5semestre-2entrega.git)
    ```

2.  **Compile e Execute o backend (Spring Boot):**
    Abra um terminal na raiz do projeto (onde o `pom.xml` está localizado) e execute o seguinte comando Maven:
    ```bash
    mvn spring-boot:run
    ```
    A aplicação backend estará rodando em `http://localhost:8080`.

3.  **Acesse o Frontend:**
    Abra o arquivo `src/main/resources/static/index.html` em seu navegador, ou acesse `http://localhost:8080/index.html` (ou apenas `http://localhost:8080/` se configurado como página padrão).

4.  **Acesse o Console do H2 (Opcional):**
    Para visualizar e interagir diretamente com o banco de dados H2 em memória, acesse `http://localhost:8080/h2-console` em seu navegador.
    *   **JDBC URL:** `jdbc:h2:mem:caronadb` (verifique o `application.properties` se diferente)
    *   **User Name:** `sa`
    *   **Password:** (deixe em branco ou conforme definido no `application.properties`)

## Como Usar a Aplicação

1.  **Página Inicial:** Ao abrir `index.html`, você verá a interface principal.
2.  **Oferecer Carona:**
    *   Preencha os campos "Origem", "Destino", "Data", "Horário", "Vagas" e "Valor".
    *   Clique em "Oferecer Carona".
    *   *Nota: O ID do motorista está atualmente fixo no frontend (`script.js`) como `1L` para fins de demonstração.*
3.  **Buscar Caronas:**
    *   Preencha "Origem" e/ou "Destino" e/ou "Data".
    *   Clique em "Buscar Caronas". Os resultados serão exibidos abaixo.
4.  **Reservar Carona:**
    *   Nos resultados da busca, clique no botão "Reservar" da carona desejada.
    *   *Nota: O ID do passageiro está atualmente fixo no frontend (`script.js`) como `2L` para fins de demonstração e para evitar que o motorista reserve a própria carona.*
5.  **Minhas Caronas:**
    *   Clique no botão "Minhas Caronas".
    *   Serão exibidas as caronas que você ofereceu (como motorista com ID `1L`) e as caronas que você reservou (como passageiro com ID `2L`).

## Endpoints da API (Principais)

*   `GET /api/caronas/buscar?origem={origem}&destino={destino}&data={data}`: Busca caronas.
*   `POST /api/caronas/oferecer`: Oferece uma nova carona.
*   `POST /api/caronas/reservar`: Reserva uma vaga em uma carona.
*   `GET /api/caronas/oferecidas/{motoristaId}`: Lista caronas oferecidas por um motorista.
*   `GET /api/caronas/reservadas/{passageiroId}`: Lista caronas reservadas por um passageiro.
*   `GET /api/usuarios/{id}`: Busca um usuário pelo ID (usado para obter nomes).

## Próximos Passos e Melhorias (Sugestões)

*   Implementar autenticação e gerenciamento de usuários.
*   Melhorar a interface do usuário (UX/UI).
*   Adicionar mais filtros de busca (ex: horário, valor máximo).
*   Implementar sistema de avaliação para motoristas e passageiros.
*   Adicionar notificações.
*   Escrever testes unitários e de integração.
*   Permitir cancelamento de reservas e caronas.
*   Exibir lista de passageiros para o motorista em "Minhas Caronas".

---

Este projeto foi desenvolvido como parte de um exercício ou estudo, focando na integração frontend-backend e funcionalidades básicas de uma aplicação de caronas.
