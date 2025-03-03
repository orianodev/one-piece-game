import { characterStats } from '../data/charactersInfos.js';
document.addEventListener('DOMContentLoaded', () => {
    const characterList = document.querySelector('#character-list');
    for (const character of Object.keys(characterStats)) {
        const label = document.createElement('label');
        label.setAttribute('for', character);
        const input = document.createElement('input');
        input.setAttribute('type', 'radio');
        input.setAttribute('name', 'character');
        input.setAttribute('id', character);
        input.setAttribute('value', character);
        const img = document.createElement('img');
        img.setAttribute('loading', 'lazy');
        img.setAttribute('src', `img/face/${character}.webp`);
        img.setAttribute('alt', character);
        const span = document.createElement('span');
        span.classList.add('tooltip');
        span.textContent = characterStats[character].name;
        label.appendChild(input);
        label.appendChild(img);
        label.appendChild(span);
        characterList.appendChild(label);
    }
    const randomCharacter = `
                <label for="random">
                    <input type="radio" name="character" id="random" value="random">
                    <img loading="lazy" src="img/face/random.webp" alt="random">
                    <span class="tooltip">Sélection aléatoire</span>
                </label>
            `;
    characterList.innerHTML += randomCharacter;
});
