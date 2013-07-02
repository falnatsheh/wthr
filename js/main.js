$(document).ready(function () {

    installWebApp();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (location) {
            loadWeatherData(location.coords.latitude + "," + location.coords.longitude);
        }, function (error) {
            console.log("Error: ", error);
            defaultWeather();
        }, {
            timeout: 10000
        });
    } else {
        defaultWeather();
    }
});

function installWebApp(){
    if (navigator.mozApps) {
        var checkIfInstalled = navigator.mozApps.getSelf();
        checkIfInstalled.onsuccess = function () {
            if (checkIfInstalled.result) {
               console.log("Already installed"); 
            }
            else {
                var manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp"; 
                    var installApp = navigator.mozApps.install(manifestURL);
                    installApp.onsuccess = function(data) {
                        console.log("Installed!"); 
                    };
                    installApp.onerror = function() {
                        alert("Install failed\n\n:" + installApp.error.name);
                    }; 
            }
        };
    }
    else {
        console.log("Open Web Apps not supported");
    }
}

function defaultWeather() { 
    alert("Can't retrieve the device location, defaulted to NYC.");
    loadWeatherData("nyc");
}

function loadWeatherData(q) {
    $.getJSON("http://free.worldweatheronline.com/feed/weather.ashx?q=" + q + "&callback=?&format=json&num_of_days=2&key=50fc6ff240011130123105", function (data) {
        document.getElementById('loader').style.display='none';
        var weatherCode = data.data.current_condition[0].weatherCode;
        var weatherDesc = data.data.current_condition[0].weatherDesc[0].value;
        var weatherTemp = getWeatherTemp(data.data.current_condition[0]);
        $("#temperature").html(weatherTemp + "&#176;");
        $("#weather-icon").text(getClimaChar(weatherCode, weatherDesc));
        $("body").css("background", getBackgroundColor(weatherTemp));
    });
}

function getWeatherTemp(currentCondition) {
    return currentCondition.temp_C;
}

function getBackgroundColor(temp) {
    switch (true) {

    case (temp > 50):
        return '#dd552d';

    case (temp > 40):
        return '#d26925';

    case (temp > 30):
        return '#e0833e';

    case (temp > 25):
        return '#eec458';

    case (temp > 20):
        return '#ece070';

    case (temp > 10):
        return '#DDEAF0';

    case (temp > 0):
        return '#abc7d3';

    }
}

function getClimaChar(code, weatherDesc) {
    return getClimaCharByName(getClimaNameByCode(code, weatherDesc));
}

function getClimaCharByName(name) {
    climaCharName = {
        "Cloud-Snow": "o",
        "Cloud-Lightning": "z",
        "Cloud-Hail": "e",
        "Cloud-Rain": "9",
        "Cloud-Fog": "g",
        "Cloud": "`",
        "Sun": "v",
        "Moon": "/"
    }
    return climaCharName[name];

}

function getClimaNameByCode(code, weatherDesc) {
    climaNameCode = {
        395: "Cloud-Snow",
        371: "Cloud-Snow",
        368: "Cloud-Snow",
        335: "Cloud-Snow",
        326: "Cloud-Snow",
        323: "Cloud-Snow",
        338: "Cloud-Snow",
        332: "Cloud-Snow",
        329: "Cloud-Snow",
        230: "Cloud-Snow",
        320: "Cloud-Snow",
        227: "Cloud-Snow",
        392: "Cloud-Lightning",
        386: "Cloud-Lightning",
        200: "Cloud-Lightning",
        389: "Cloud-Lightning",
        377: "Cloud-Hail",
        350: "Cloud-Hail",
        179: "Cloud-Hail",
        374: "Cloud-Hail",
        365: "Cloud-Hail",
        362: "Cloud-Hail",
        317: "Cloud-Hail",
        314: "Cloud-Hail",
        311: "Cloud-Hail",
        284: "Cloud-Hail",
        281: "Cloud-Hail",
        185: "Cloud-Hail",
        182: "Cloud-Hail",
        356: "Cloud-Rain",
        353: "Cloud-Rain",
        308: "Cloud-Rain",
        302: "Cloud-Rain",
        296: "Cloud-Rain",
        305: "Cloud-Rain",
        299: "Cloud-Rain",
        293: "Cloud-Rain",
        266: "Cloud-Rain",
        263: "Cloud-Rain",
        176: "Cloud-Rain",
        359: "Cloud-Rain",
        260: "Cloud-Fog",
        248: "Cloud-Fog",
        143: "Cloud-Fog",
        122: "Cloud",
        119: "Cloud",
        116: "Cloud",
        113: {
            "Sunny": "Sun",
            "Clear": "Moon"
        }
    }

    var climaName;
    if (code == 113) {
        climaName = climaNameCode[code][weatherDesc];
    } else {
        climaName = climaNameCode[code];
    }

    return climaName;
}