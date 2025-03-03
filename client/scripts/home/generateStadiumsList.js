import { stadiumStats } from "../data/stadiumsInfos.js";
document.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#stadium-list');
    for (const stadium of Object.keys(stadiumStats)) {
        const option = document.createElement('option');
        option.setAttribute('value', stadiumStats[stadium].img);
        option.textContent = stadiumStats[stadium].name;
        select.appendChild(option);
    }
});
