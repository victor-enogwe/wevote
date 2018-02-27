function generateBatteryInfo(score, responses){
    let batteryInfo = {};
    if (score === 0){
        batteryInfo.batteryType = 'empty';
        batteryInfo.batteryColor = 'red';
    } else if (score > 0 && score < 25){
        batteryInfo.batteryType = 'quarter';
        batteryInfo.batteryColor = 'red';
    } else if (score >= 25 && score < 51){
        batteryInfo.batteryType = 'half';
        batteryInfo.batteryColor = 'orange';
    } else if (score >= 51 && score < 75){
        batteryInfo.batteryType = 'three-quarters';
        batteryInfo.batteryColor = 'yellow';
    } else if (score >= 75) {
        batteryInfo.batteryType = 'full';
        batteryInfo.batteryColor = 'greenyellow';
    }
    if (responses.Q2 === 'A'){
        batteryInfo.batteryNotification = 'Congrats on having your Permanent Voters Card. ' +
            'Encourage your family and friends to do the same.';
    } else if (responses.Q2 === 'B'){
        batteryInfo.batteryNotification = 'It is good that you have a temporary voters card. ' +
            'However, you need to get your Permanent Voters Card in order to vote.';
    } else if (responses.Q2 === 'C'){
        batteryInfo.batteryNotification = "You cannot vote if you don't have your Permanent Voters Card. " +
            "Ensure to get it as soon as possible.";
    } else if (responses.Q2 === 'D'){
        batteryInfo.batteryNotification = 'You can get another voters card if yours gets lost. ' +
            'Visit the registration center closest to you or INEC office in your LGA .';
    }
    return batteryInfo;
}

export default generateBatteryInfo;
