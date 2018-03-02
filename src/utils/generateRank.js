import slow from '../assets/slow.png';
import citizen from '../assets/citizen.gif';
import patroit from '../assets/patroit.jpg';
import knight from '../assets/knight.png';

function generateRank(score) {
    let rank = {};
    if (score < 25) {
        rank.image = slow;
        rank.title = 'Slow Mover';
    } else if (score >= 25 && score < 51) {
        rank.image = citizen;
        rank.title = 'Citizen';
    } else if (score >= 51 && score < 75) {
        rank.image = patroit;
        rank.title = 'Patroit';
    } else if (score >= 75) {
        rank.image = knight;
        rank.title = 'Knight';
    }
    return rank;
}

export default generateRank;
