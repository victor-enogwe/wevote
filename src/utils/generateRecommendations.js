function generateRecommendations(responses) {
    let recommendations = [];
    if(responses.Q2){
        responses.Q2 === 'A' &&
        recommendations.push("Congratulations! You have your Permanent Voters Card so you can vote.");
        responses.Q2 === 'B' &&
        recommendations.push("Great! You have a temporary voters card but you need to collect your Permanent Voters " +
            "Card to vote.");
        responses.Q2 === 'C' &&
        recommendations.push("You need to have your Permanent Voters card at hand in order to vote.");
        responses.Q2 === 'D' &&
        recommendations.push("It is possible to get another voters card. Visit a registration center near you " +
            "or the INEC office in your Local Government.");
    }
    if(responses.Q3){
        responses.Q3 === 'A' &&
        recommendations.push("It's a good thing you registered within your city so you can easily come out to vote.");
        responses.Q3 === 'B' &&
        recommendations.push("Since you didn't register within your city, it would be very difficult for you to vote " +
            "because there will be restriction of movement on the election days. However, you can transfer your " +
            "registration to a center near you. Visit a registration center or an INEC office.");
    }
    if (responses.Q4){
        (['A', 'B', 'C'].includes(responses.Q4) && responses.Q2 === 'B') &&
        recommendations.push("Visit the center where you registered to collect your Permanent Voters Card.");
        (responses.Q4 === 'D' && responses.Q2 === 'B') &&
        recommendations.push("Visit a registration center to begin a new registration.");
    }
    if (responses.Q5){
        (responses.Q5 === 'A' && ['A', 'B', 'C'].includes(responses.Q4)) &&
        recommendations.push("You should pick up your Temporary Voters card from the center you registered " +
            "and get your Permanent Voters Card when it's ready.");
        (responses.Q5 === 'A' && responses.Q4 === 'D') &&
        recommendations.push("Visit a registration center to begin a new registration.");
        responses.Q5 === 'B' &&
        recommendations.push("You cannot get a Voters card without registering. Visit a registration center near you " +
            "or the INEC office in your Local Government to get registered.");
    }
    return recommendations;
}

export default generateRecommendations;
