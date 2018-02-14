function generateBatteryInfo(score){
    let batteryInfo = {};
    if (score === 0){
        batteryInfo.batteryType = 'empty';
        batteryInfo.batteryColor = 'red';
        batteryInfo.batteryNotification = 'You have not checked your voter readiness yet. ' +
            'Click on the link to check it now.';
    } else if (score > 0 && score < 25){
        batteryInfo.batteryType = 'quarter';
        batteryInfo.batteryColor = 'orange';
        batteryInfo.batteryNotification = 'You have not registered as a voter. ' +
            'Hence you cannot vote. If you now have your Voters card, click the link to check your VRI again.';
    } else if (score >= 25 && score < 50){
        batteryInfo.batteryType = 'half';
        batteryInfo.batteryColor = 'yellow';
        batteryInfo.batteryNotification = 'You have not been issued a voters card. ' +
            'Hence you cannot vote. If you now have your Voters card, click the link to check your VRI again.';
    } else if (score >= 50 && score < 75){
        batteryInfo.batteryType = 'three-quarters';
        batteryInfo.batteryColor = 'orange';
        batteryInfo.batteryNotification = 'You did not register in your city of residence. ' +
            'You should consider transferring your registration. If you have done that, ' +
            'click the link to check your VRI again.';
    } else if (score >= 75) {
        batteryInfo.batteryType = 'full';
        batteryInfo.batteryColor = 'greenyellow';
        batteryInfo.batteryNotification = 'You have a voters card and you are ready to vote. ' +
            'Encourage your family and friends to do the same.';
    }
    return batteryInfo;
}

export default generateBatteryInfo;
