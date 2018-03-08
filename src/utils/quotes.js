const quotes = [
    "",
    "Vote for what is right.",
    "Elections belong to the people. It's their decision. If they decide to turn their back on the fire and burn " +
    "their behinds, then they will just have to sit on their blisters.",
    "A vote is like a rifle: its usefulness depends upon the character of the user.",
    "The difference between a democracy and a dictatorship is that in a democracy you vote first and take orders later;" +
    " in a dictatorship you don't have to waste your time voting.",
    "Democracy cannot succeed unless those who express their choice are prepared to choose wisely. " +
    "The real safeguard of democracy, therefore, is education.",
    "Democracy is not just the right to vote, it is the right to live in dignity.",
    "Every election is determined by the people who show up.",
    "The ballot is stronger than the bullet.",
    "To permit irresponsible authority is to sell disaster.",
    "Our lives begin to end the day we become silent about things that matter.",
    "The ballot is stronger than the bullet.",
    "When one with honeyed words but evil mind " +
    "persuades the mob, great woes befall the state.",
    "It is always possible that a stupid and a mean leader can keep winning the elections and as for the result, " +
    "there is no possibility here, there is only certainty: His country will keep sinking!",
    "If you don't vote, you lose the right to complain",
    "Bad officials are elected by good citizens who do not vote",
    "Be the change that you wish to see in the world",
    "You can either vote by voting, or vote by not voting. If you do not vote, someone else's votes counts more. " +
    "Its math",
    "The people don't know their true power",
    "Voters must have faith in the electoral system for our democracy to succeed",
    "Ask not what your country can do for you; ask what you can do for your country",
    "You can't fix stupid but you can vote it out",
    "The most powerful thing we own is our vote"
];

function getQuote(){
    return quotes[new Date().getDate()]
}

export default getQuote;
