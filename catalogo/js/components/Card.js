// Importa utilitários para gerar dados aleatórios (scores, durações, badges) e processar links do YouTube
import { getYouTubeId, getRandomMatchScore, getRandomDuration, getRandomAgeBadge } from '../utils.js';

// Função que cria a estrutura DOM completa de um card de filme/série
export function createCard(item) {
    // Cria o container principal do card
    const card = document.createElement('div');
    card.className = 'movie-card';
    // Adiciona classe CSS caso o usuário já tenha assistido parte do conteúdo
    if (item.progress) {
        card.classList.add('has-progress');
    }

    // Configura a imagem de capa (poster)
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = `Movie cover`;

    // Prepara o iframe para carregar o trailer em hover
    const iframe = document.createElement('iframe');
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media";

    // Obtém o código único do vídeo para o embed do YouTube
    const videoId = getYouTubeId(item.youtube);

    // Insere os elementos visuais base no card
    card.appendChild(iframe);
    card.appendChild(img);

    // Gera informações aleatórias para simular uma base de dados real
    const ageBadge = getRandomAgeBadge();
    const details = document.createElement('div');
    details.className = 'card-details';
    // Define o conteúdo do painel de informações que aparece no zoom
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                <!-- Alterna ícone baseado no progresso do item -->
                ${item.progress ? '<button class="btn-icon"><i class="fas fa-check"></i></button>' : '<button class="btn-icon"><i class="fas fa-plus"></i></button>'}
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge ${ageBadge.class}">${ageBadge.text}</span>
            <span class="duration">${getRandomDuration(item.progress)}</span>
            <span class="resolution">HD</span>
        </div>
        <div class="details-tags">
            <span>Empolgante</span>
            <span>Animação</span>
            <span>Ficção</span>
        </div>
    `;
    card.appendChild(details);

    // Se houver progresso, cria a barra visual vermelha na parte inferior do card
    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`; // Define o preenchimento da barra baseado no dado
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    let playTimeout;
    // Lógica ao passar o mouse: define a origem do zoom e carrega o trailer após um delay
    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        
        // Evita que o card estoure as bordas da tela mudando o ponto de origem do zoom
        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        // Carrega o trailer apenas se o usuário mantiver o mouse por 600ms (evita lentidão ao navegar rápido)
        playTimeout = setTimeout(() => {
            // Monta a URL do embed com autoplay, mudo e loop habilitados
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
            iframe.classList.add('playing');
            img.classList.add('playing-video');
        }, 600);
    });

    // Lógica ao retirar o mouse: cancela o carregamento e limpa o iframe para poupar memória
    card.addEventListener('mouseleave', () => {
        clearTimeout(playTimeout); // Cancela o timer se o mouse sair antes dos 600ms
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = ""; // Interrompe a conexão com o YouTube imediatamente
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    return card;
}
