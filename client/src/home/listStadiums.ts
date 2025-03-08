import { StadiumID, stadiumStats } from "../data/stadiums.js";

document.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#stadium-list') as HTMLSelectElement;
    for (const stadium of Object.keys(stadiumStats)) {
        const option = document.createElement('option');
        option.setAttribute('value', stadiumStats[(stadium as StadiumID)].id);
        option.textContent = stadiumStats[(stadium as StadiumID)].name;
        select.appendChild(option);
    }
})