document.addEventListener('DOMContentLoaded', function () {
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    function updateActiveState(targetId) {
        views.forEach(view => {
            view.classList.toggle('active', view.id === targetId);
        });
        navLinks.forEach(link => {
            if (link.getAttribute('href') === '#' + targetId) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active'); 
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active'); 
            }
        });
    }

    function handleNavClick(event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        updateActiveState(targetId);
        
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            if (mobileMenuButton) {
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    if (mobileMenuButton && mobileMenu) { 
        mobileMenuButton.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuButton.setAttribute('aria-expanded', String(!isHidden)); 
        });
    }
    
    const searchForm = document.getElementById('search-form');
    const searchResults = document.getElementById('search-results');
    const searchFormFeedback = document.getElementById('search-form-feedback');

    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) { 
            e.preventDefault();
            searchFormFeedback.textContent = 'Buscando caronas...';
            searchFormFeedback.className = 'mb-4 text-sm text-blue-600';
            searchResults.classList.add('hidden'); 
            const resultsList = searchResults.querySelector('#search-results-list'); 
            if (resultsList) {
                resultsList.innerHTML = ''; 
            }

            const origem = document.getElementById('origem').value;
            const destino = document.getElementById('destino').value;
            const data = document.getElementById('data').value;

            try {
                let queryString = '/api/caronas/buscar?';
                if (origem) {
                    queryString += `origem=${encodeURIComponent(origem)}&`;
                }
                if (destino) {
                    queryString += `destino=${encodeURIComponent(destino)}&`;
                }
                if (data) {
                    queryString += `data=${encodeURIComponent(data)}&`;
                }
                if (queryString.endsWith('&') || queryString.endsWith('?')) {
                    queryString = queryString.slice(0, -1);
                }

                const response = await fetch(queryString);

                if (response.status === 204 || !response.ok) { 
                    let errorMessage = 'Nenhuma carona encontrada para este trajeto.';
                    if (response.status !== 204 && response.status !== 404) { 
                        const errorData = await response.json().catch(() => null);
                        errorMessage = errorData?.message || `Erro ao buscar caronas: ${response.status}`;
                    }
                    searchFormFeedback.textContent = errorMessage;
                    searchFormFeedback.className = 'mb-4 text-sm text-orange-600';
                    
                    const resultsHeader = searchResults.querySelector('h3');
                    if (resultsHeader) {
                        resultsHeader.textContent = 'Caronas Encontradas';
                    }
                    if (resultsList) resultsList.innerHTML = '<p class="text-gray-600">Nenhuma carona disponível no momento.</p>'; 
                    searchResults.classList.remove('hidden');
                    return;
                }

                const caronas = await response.json();

                const resultsHeader = searchResults.querySelector('h3');
                if (resultsHeader) {
                    resultsHeader.textContent = 'Caronas Encontradas';
                }
                
                if (resultsList) {
                    if (caronas.length === 0) {
                        resultsList.innerHTML = '<p class="text-gray-600">Nenhuma carona disponível no momento.</p>';
                    } else {
                        caronas.forEach(carona => {
                            console.log('Processing carona for search display:', JSON.stringify(carona, null, 2));
                            console.log('carona.dataHora value:', carona.dataHora, 'type:', typeof carona.dataHora);

                            const card = document.createElement('div');
                            card.className = 'card bg-white p-4 rounded-lg shadow';
                            card.setAttribute('tabindex', '0'); 
                            
                            let dataHora;
                            if (carona.dataHora && !isNaN(new Date(carona.dataHora).getTime())) {
                                dataHora = new Date(carona.dataHora);
                            } else {
                                console.error('Invalid or missing dataHora for carona:', carona.id, 'Value:', carona.dataHora);
                                card.innerHTML = `
                                    <h4 class="font-semibold text-lg text-indigo-700">${carona.origem} <i class="fas fa-arrow-right mx-1"></i> ${carona.destino}</h4>
                                    <p class="text-sm text-gray-600">Motorista: ${carona.motorista ? carona.motorista.nome : 'Não informado'}</p>
                                    <p class="text-sm text-red-600">Data/Hora: Inválida ou Ausente</p> 
                                    <p class="text-sm text-gray-600">Vagas: ${carona.vagasDisponiveis}</p>
                                    ${carona.notas ? `<p class="text-sm text-gray-500 mt-1">Notas: ${carona.notas}</p>` : ''}
                                    <button class="mt-2 bg-gray-400 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed" disabled>Reservar Vaga (Indisponível)</button>
                                `;
                                resultsList.appendChild(card);
                                return;
                            }
                            
                            const formatadorData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            const formatadorHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });

                            let buttonHtml;
                            if (carona.reservadaPeloUsuarioAtual) {
                                buttonHtml = '<button class="mt-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed w-full" disabled>Reservado</button>';
                            } else if (carona.vagasDisponiveis > 0) {
                                buttonHtml = `<button class="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 reservavel" data-carona-id="${carona.id}">Reservar Vaga</button>`;
                            } else {
                                buttonHtml = '<button class="mt-2 bg-gray-400 text-white font-semibold py-2 px-4 rounded-md text-sm cursor-not-allowed w-full" disabled>Vagas Esgotadas</button>';
                            }

                            card.innerHTML = `
                                <h4 class="font-semibold text-lg text-indigo-700">${carona.origem} <i class="fas fa-arrow-right mx-1"></i> ${carona.destino}</h4>
                                <p class="text-sm text-gray-600">Motorista: ${carona.motorista ? carona.motorista.nome : 'Não informado'}</p>
                                <p class="text-sm text-gray-600">Data: ${formatadorData.format(dataHora)}</p>
                                <p class="text-sm text-gray-600">Hora: ${formatadorHora.format(dataHora)}</p>
                                <p class="text-sm text-gray-600">Vagas: ${carona.vagasDisponiveis}</p>
                                ${carona.notas ? `<p class="text-sm text-gray-500 mt-1">Notas: ${carona.notas}</p>` : ''}
                                ${buttonHtml}
                            `;
                            resultsList.appendChild(card);
                        });
                    }
                }

                searchResults.classList.remove('hidden');
                searchFormFeedback.textContent = 'Exibindo resultados da busca.';
                searchFormFeedback.className = 'mb-4 text-sm text-green-600';

                if(resultsList && resultsList.children.length > 0) {
                    const firstResultCard = resultsList.querySelector('.card');
                    if (firstResultCard) {
                        firstResultCard.focus();
                    }
                }

            } catch (error) {
                console.error('Erro ao buscar caronas:', error);
                searchFormFeedback.textContent = 'Ocorreu um erro ao buscar as caronas. Tente novamente mais tarde.';
                searchFormFeedback.className = 'mb-4 text-sm text-red-600';
                const resultsHeader = searchResults.querySelector('h3');
                if (resultsHeader) {
                    resultsHeader.textContent = 'Caronas Encontradas';
                }
                if (resultsList) resultsList.innerHTML = '<p class="text-red-600">Erro ao carregar caronas.</p>'; 
                searchResults.classList.remove('hidden');
            }
        });
    }

    const offerForm = document.getElementById('offer-form');
    const offerFormFeedback = document.getElementById('offer-form-feedback');

    if (offerForm) {
        offerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            offerFormFeedback.textContent = 'Enviando sua oferta de carona...';
            offerFormFeedback.className = 'mb-4 text-sm text-blue-600';

            const origem = document.getElementById('oferecer-origem').value;
            const destino = document.getElementById('oferecer-destino').value;
            const data = document.getElementById('oferecer-data').value;
            const hora = document.getElementById('oferecer-hora').value;
            const assentos = parseInt(document.getElementById('oferecer-assentos').value);
            const notas = document.getElementById('oferecer-notas').value;

            if (!origem || !destino || !data || !hora || !assentos) {
                offerFormFeedback.textContent = 'Por favor, preencha todos os campos obrigatórios.';
                offerFormFeedback.className = 'mb-4 text-sm text-red-600';
                return;
            }

            const dataHora = `${data}T${hora}:00`; 

            const rideData = {
                origem,
                destino,
                dataHora,
                vagasDisponiveis: assentos,
                notas,
                motorista: { id: 1 } 
            };

            try {
                const response = await fetch('/api/caronas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rideData),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido ao oferecer carona.' }));
                    throw new Error(errorData.message || `Erro ${response.status}`);
                }

                const novaCarona = await response.json();
                if (offerFormFeedback) {
                    offerFormFeedback.textContent = 'Carona oferecida com sucesso!';
                    offerFormFeedback.className = 'mb-4 text-sm text-green-600';
                }
                offerForm.reset();
                
                console.log('Carona oferecida:', novaCarona);
            } catch (error) {
                console.error('Erro ao oferecer carona:', error);
                if (offerFormFeedback) {
                    offerFormFeedback.textContent = `Erro ao oferecer carona: ${error.message || 'Ocorreu um erro.'}. Verifique os dados e tente novamente.`;
                    offerFormFeedback.className = 'mb-4 text-sm text-red-600';
                } else {
                    console.error("Falha ao exibir mensagem de erro: elemento 'offer-form-feedback' não encontrado.");
                    alert(`Erro ao oferecer carona: ${error.message || 'Ocorreu um erro.'}. Verifique os dados e tente novamente.`);
                }
            }
        });
    }

    async function handleReservarVaga(event) {
        if (!event.target.classList.contains('reservavel')) {
            return;
        }
        const caronaId = event.target.dataset.caronaId;
        const passageiroId = 1;

        if (!caronaId) {
            alert('ID da carona não encontrado.');
            return;
        }

        event.target.disabled = true;
        event.target.textContent = 'Reservando...';

        try {
            const response = await fetch(`/api/caronas/${caronaId}/reservar?passageiroId=${passageiroId}`, {
                method: 'POST',
            });

            if (!response.ok) {
                let errorText = `Erro ${response.status} ${response.statusText}`;
                let responseBodyForDebugging = '';
                let responseHeadersForDebugging = '';

                response.headers.forEach((value, name) => {
                    responseHeadersForDebugging += `${name}: ${value}\n`;
                });
                console.log("Response Headers:\n", responseHeadersForDebugging);

                try {
                    responseBodyForDebugging = await response.text();
                    console.log("Response Body (as text):\n", responseBodyForDebugging);
                    
                    try {
                        const errorData = JSON.parse(responseBodyForDebugging);
                        errorText = errorData.message || errorData.error || JSON.stringify(errorData);
                    } catch (jsonError) {
                        errorText = responseBodyForDebugging || errorText; 
                    }

                } catch (e) {
                    console.error("Error reading response body:", e);
                    errorText = `Erro ${response.status} ${response.statusText}. Não foi possível ler o corpo da resposta. Verifique o console para detalhes dos headers.`;
                }
                
                console.error("Final error to be thrown by client:", errorText);
                throw new Error(errorText);
            }

            const reserva = await response.json();
            alert('Vaga reservada com sucesso!');
            event.target.textContent = 'Reservado';
            event.target.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
            event.target.classList.add('bg-green-500', 'cursor-not-allowed');
            
            await carregarMinhasCaronas(); 

        } catch (error) {
            console.error('Erro ao reservar vaga:', error);
            alert(`Erro ao reservar vaga: ${error.message}`);
            event.target.disabled = false;
            event.target.textContent = 'Reservar Vaga';
        }
    }

    document.getElementById('search-results-list').addEventListener('click', handleReservarVaga);

    async function carregarMinhasCaronas() {
        const passageiroId = 1;
        const minhasCaronasList = document.getElementById('minhas-caronas-list');
        const feedbackMinhasCaronas = document.getElementById('minhas-caronas-feedback');

        if (!minhasCaronasList || !feedbackMinhasCaronas) return;

        feedbackMinhasCaronas.textContent = 'Carregando suas caronas...';
        feedbackMinhasCaronas.className = 'text-sm text-blue-600';
        minhasCaronasList.innerHTML = '';

        try {
            const response = await fetch(`/api/caronas/minhas-reservas?passageiroId=${passageiroId}`);
            if (response.status === 204) {
                minhasCaronasList.innerHTML = '<p class="text-gray-600">Você ainda não reservou nenhuma carona.</p>';
                feedbackMinhasCaronas.textContent = '';
                console.log('Minhas Caronas: Nenhuma reserva encontrada (204 No Content).');
                return;
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Minhas Caronas: Erro ao buscar - Status:', response.status, 'Data:', errorData);
                throw new Error(errorData?.message || `Erro ao buscar suas caronas: ${response.status}`);
            }

            const reservas = await response.json();
            console.log('Minhas Caronas: Reservas recebidas do backend:', JSON.stringify(reservas, null, 2));

            if (reservas.length === 0) {
                minhasCaronasList.innerHTML = '<p class="text-gray-600">Você ainda não reservou nenhuma carona.</p>';
            } else {
                reservas.forEach(reserva => {
                    const card = document.createElement('div');
                    card.className = 'card bg-white p-4 rounded-lg shadow';

                    const carona = reserva.carona;
                    let caronaDataHoraStr = 'Data/Hora da Carona: Inválida ou Ausente';
                    let reservadoEmStr = 'Reservado em: Inválido ou Ausente';

                    if (carona && carona.dataHora && !isNaN(new Date(carona.dataHora).getTime())) {
                        const dataHoraCarona = new Date(carona.dataHora);
                        const formatadorData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        const formatadorHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        caronaDataHoraStr = `Data: ${formatadorData.format(dataHoraCarona)}<br>Hora: ${formatadorHora.format(dataHoraCarona)}`;
                    } else {
                        console.error('Invalid or missing dataHora for Minhas Caronas (carona):', carona ? carona.id : 'undefined carona', 'Value:', carona ? carona.dataHora : 'undefined carona');
                        caronaDataHoraStr = '<p class="text-sm text-red-600">Data/Hora da Carona: Inválida</p>';
                    }

                    if (reserva.dataHoraReserva && !isNaN(new Date(reserva.dataHoraReserva).getTime())) {
                        reservadoEmStr = `Reservado em: ${new Intl.DateTimeFormat('pt-BR', {dateStyle: 'short', timeStyle: 'short'}).format(new Date(reserva.dataHoraReserva))}`;
                    } else {
                        console.error('Invalid or missing dataHoraReserva for Minhas Caronas (reserva):', reserva.id, 'Value:', reserva.dataHoraReserva);
                        reservadoEmStr = '<p class="text-sm text-red-600">Reservado em: Inválido</p>';
                    }

                    card.innerHTML = `
                        <h4 class="font-semibold text-lg text-indigo-700">${carona ? carona.origem : 'N/A'} <i class="fas fa-arrow-right mx-1"></i> ${carona ? carona.destino : 'N/A'}</h4>
                        <p class="text-sm text-gray-600">Motorista: ${carona && carona.motorista ? carona.motorista.nome : 'Não informado'}</p>
                        <div class="text-sm text-gray-600">${caronaDataHoraStr}</div>
                        <p class="text-sm text-gray-500 mt-1">${reservadoEmStr}</p>
                    `;
                    minhasCaronasList.appendChild(card);
                });
            }
            feedbackMinhasCaronas.textContent = 'Suas caronas reservadas.';
            feedbackMinhasCaronas.className = 'text-sm text-green-600';
        } catch (error) {
            console.error('Erro ao carregar minhas caronas:', error);
            minhasCaronasList.innerHTML = '<p class="text-red-600">Ocorreu um erro ao carregar suas caronas.</p>';
            feedbackMinhasCaronas.textContent = 'Erro ao carregar.';
            feedbackMinhasCaronas.className = 'text-sm text-red-600';
        }
    }

    async function carregarMinhasCaronasOferecidas() {
        const motoristaId = 1;
        const minhasOferecidasList = document.getElementById('minhas-oferecidas-list');
        const feedbackMinhasOferecidas = document.getElementById('minhas-oferecidas-feedback');

        if (!minhasOferecidasList || !feedbackMinhasOferecidas) {
            console.error('Element for offered rides list or feedback not found');
            return;
        }

        feedbackMinhasOferecidas.textContent = 'Carregando suas caronas oferecidas...';
        feedbackMinhasOferecidas.className = 'text-sm text-blue-600';
        minhasOferecidasList.innerHTML = '';

        try {
            const response = await fetch(`/api/caronas/minhas-oferecidas?motoristaId=${motoristaId}`);
            if (response.status === 204) {
                minhasOferecidasList.innerHTML = '<p class="text-gray-600">Você ainda não ofereceu nenhuma carona.</p>';
                feedbackMinhasOferecidas.textContent = '';
                return;
            }
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ao buscar suas caronas oferecidas: ${response.status}`);
            }

            const caronasOferecidas = await response.json();
            console.log('Minhas Caronas Oferecidas: Caronas recebidas do backend:', JSON.stringify(caronasOferecidas, null, 2));

            if (caronasOferecidas.length === 0) {
                minhasOferecidasList.innerHTML = '<p class="text-gray-600">Você ainda não ofereceu nenhuma carona.</p>';
            } else {
                caronasOferecidas.forEach(carona => {
                    const card = document.createElement('div');
                    card.className = 'card bg-white p-4 rounded-lg shadow';

                    let dataHoraStr = 'Data/Hora: Inválida ou Ausente';
                    if (carona.dataHora && !isNaN(new Date(carona.dataHora).getTime())) {
                        const dataHora = new Date(carona.dataHora);
                        const formatadorData = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                        const formatadorHora = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
                        dataHoraStr = `Data: ${formatadorData.format(dataHora)}<br>Hora: ${formatadorHora.format(dataHora)}`;
                    } else {
                        dataHoraStr = '<p class="text-sm text-red-600">Data/Hora: Inválida</p>';
                    }

                    card.innerHTML = `
                        <h4 class="font-semibold text-lg text-indigo-700">${carona.origem} <i class="fas fa-arrow-right mx-1"></i> ${carona.destino}</h4>
                        <div class="text-sm text-gray-600">${dataHoraStr}</div>
                        <p class="text-sm text-gray-600">Vagas Disponíveis: ${carona.vagasDisponiveis}</p>
                        ${carona.notas ? `<p class="text-sm text-gray-500 mt-1">Notas: ${carona.notas}</p>` : ''}
                    `;
                    minhasOferecidasList.appendChild(card);
                });
            }
            feedbackMinhasOferecidas.textContent = 'Suas caronas oferecidas.';
            feedbackMinhasOferecidas.className = 'text-sm text-green-600';
        } catch (error) {
            console.error('Erro ao carregar suas caronas oferecidas:', error);
            minhasOferecidasList.innerHTML = '<p class="text-red-600">Ocorreu um erro ao carregar suas caronas oferecidas.</p>';
            feedbackMinhasOferecidas.textContent = 'Erro ao carregar.';
            feedbackMinhasOferecidas.className = 'text-sm text-red-600';
        }
    }

    
    function onViewChange(targetId) {
        if (targetId === 'minhas') { 
            carregarMinhasCaronas();
            carregarMinhasCaronasOferecidas();
        }
    }

    const originalUpdateActiveState = updateActiveState;
    updateActiveState = function(targetId) {
        originalUpdateActiveState(targetId);
        onViewChange(targetId);
    };

    const initialViewId = window.location.hash ? window.location.hash.substring(1) : 'buscar';
    updateActiveState(initialViewId);

    const accordions = document.querySelectorAll('.accordion-title');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});
