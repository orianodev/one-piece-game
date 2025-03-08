import { stadiumStats } from "../data/stadiums.js";
document.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#stadium-list');
    for (const stadium of Object.keys(stadiumStats)) {
        const option = document.createElement('option');
        option.setAttribute('value', stadiumStats[stadium].id);
        option.textContent = stadiumStats[stadium].name;
        select.appendChild(option);
    }
});
