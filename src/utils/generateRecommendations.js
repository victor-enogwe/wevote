function generateRecommendations(responses) {
    let recommendations = [];
    if(responses.Q2){
        responses.Q2 === 'A' &&
        recommendations.push("Congratulations! You have your Permanent Voters Card so you can vote");
        responses.Q2 === 'B' &&
        recommendations.push("Great! You have a temporary voters card but you need to collect your Permanent Voters " +
            "Card to vote");
        responses.Q2 === 'C' &&
        recommendations.push("You need to have your Permanent Voters card at hand in order to vote");
        responses.Q2 === 'D' &&
        recommendations.push("It is possible to get another voters card. Visit a registration center near you" +
            "or the INEC office in your Local Government.");
    }
    if(responses.Q3){
        responses.Q3 === 'A' &&
        recommendations.push("It's a good thing you registered within your city so you can easily come out to vote");
        responses.Q3 === 'B' &&
        recommendations.push("It would be very difficult for you to vote because there will be restriction in" +
            "movement on the election days");
    }
    // if (responses.Q4){
    //     ['A', 'B', 'C'].includes(responses.Q4) &&
    //     recommendations.push("It's a good thing you registered within your city so you can easily come out to vote");
    // }
    return recommendations;
}

export default generateRecommendations;
