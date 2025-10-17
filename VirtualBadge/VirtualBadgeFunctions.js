var bBadgeBack = true;
var iBadgeColour = 1;

function showBadgeColourDialog() {
    modalOverlay.classList.add('active');
}

function showCheatsConsoleDialog() {
    modalCheatsOverlay.classList.add('active');
}

function setBadgeColour() {
    var modalOverlay = document.getElementById('modalOverlay');
    var optionSelect = document.getElementById('optionSelect');
    var btnAttendee = document.getElementById('btnBackground');
    var optText;
    var strSuffix, strPrefix;

    if (bBadgeBack) strSuffix = "Back";
    else strSuffix = "Front";

    switch (optionSelect.value) {
        case "2":
            strPrefix = "BadgeRed";
            optText = "Volunteer";
            break;
        case "0":
            strPrefix = "BadgeYellow";
            optText = "Presenter";
            break;
        default:
        case "1":
            strPrefix = "BadgeBlue";
            optText = "Attendee";
            break;        
    }

    document.getElementById('BadgeImage').src = "Images/"+strPrefix+"_"+strSuffix+".PNG";

    if (optText!=null) btnAttendee.textContent = optText+" Mode";
    modalOverlay.classList.remove('active');
}

function applyCheatCode() {
    var cheatCode;

    cheatCode = btoa(document.getElementById('txtCheatCode').value);
    
    switch (cheatCode) {
        case "U3BlZWR5RWNoaWRuYQ==":
            showMovementSpeedSlider();
            break;
        case "RWFzeU1vZGVQbGVhc2U=":
            setEasyMode();
            break;
        case "Tm9DaGFsbGVuZ2VzRm9yTWU=":
            setChallengesComplete();
            break;
        default:
            alert(cheatCode+" is not a valid cheat code.");
    }

    modalCheatsOverlay.classList.remove('active');
}

function showMovementSpeedSlider() {
    document.getElementById('divExtraToolbar').innerHTML = '<label for="sldSpeed">Speed:</label><input type="range" id="sldSpeed" name="sldSpeed" min="1" max="5" step="1" value="1"/>';
    document.getElementById('sldSpeed').oninput = function() {
        movementSpeed = this.value;
    } 
}

function setChallengesComplete() {
    var c;
    for (var i=0; i<5; i++) {
        c = challenges[i];
        markChallengeAsCompleted(false, i);
        collectAnimal(c.AssociatedAnimalPos);
    }
    saveUserSettings();
}

function setEasyMode() {
    for (var i=0; i<challenges.length; i++) {
        challenges[i].OfflineKPReq = 6;
    }
}

function showOtherBadgeSide() {
    bBadgeBack = !bBadgeBack;

    if (!bBadgeBack) document.getElementById("BadgeImage").style.zIndex = 3;
    else document.getElementById("BadgeImage").style.zIndex = 0;

    setBadgeColour();
}
