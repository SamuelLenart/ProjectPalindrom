import { Animal } from './animal.js'
import {keys} from '../keys.js'

export class TreeFrog extends Animal {

    constructor(name, weight, color, pohlavie) {
        super(name, weight, color)
        this.pohlavie = pohlavie
        this.weather = this.#createWeatherForecast()
        this.weatherForm = document.getElementById("weatherForm")
        this.weatherKey = keys.apiKeys.weather
        this.geoKey =  keys.apiKeys.geo
       
        this.weatherForm.addEventListener("submit", (e) => {
            e.preventDefault()
            this.getActualWeatherForCity()
        })

        chrome.storage.sync.get(['weatherAPIKey'], (url) => {
            this.weatherKey = url.weatherAPIKey;
        });
        chrome.storage.sync.get(['geoAPIKey'], (url) => {
            this.geoKey = url.geoAPIKey;
        })
    }

    informWorld(message) {
        super.informWorld(message)
        if (!this._dead) {
            this.news.innerHTML += (" kvak")
        }
    }

    makeSound() {
        if (this._dead) {
            this.informWorld("...")
        } else {
            this.informWorld("kvaaaaaak")
        }
    }

    #createWeatherForecast() {
        let weatherParagraph = document.getElementById("weather")
        if (!weatherParagraph) {
            weatherParagraph = document.createElement("p")
            weatherParagraph.id = "weather"
            document.body.appendChild(weatherParagraph)
            return weatherParagraph
        }
        return document.getElementById("weather")
    }

    makeForecast() {
        if (this._dead) {
            this.informWorld("uz nikdy nic nebude predpovedat")
        } else {
            const mestoKrajina = 'Kosice,SK'
            fetch('https://api.openweathermap.org/data/2.5/weather?q=' + mestoKrajina + '&appid=' + this.weatherKey + '&units=metric')
                .then(
                    resp => this.respToJSON(resp)
                )
                .then(json => {
                    const location = json.name
                    const conditions = json.weather[0].description
                    const temperature = json.main.temp
                    this.weather.innerHTML += ("<br>" + this.constructor.name + " " + this.name + " " + location + " " + temperature + " " + conditions)
                })
                .catch(error => {
                    console.log(error)
                });
        }
    }

    getActualWeatherForCity() {
        const city = document.getElementById("city").value
        const country = document.getElementById("country").value

        fetch('https://api.opencagedata.com/geocode/v1/json?q=' + city + '%2C%20' + country + '&key=' + this.geoKey)
            .then(
                resp => this.respToJSON(resp)
            )
            .then(json => {
                if (json.results.length > 0) {//city found
                    const lat = json.results[0].geometry.lat
                    const lng = json.results[0].geometry.lng
                    const countryAbb = json.results[0].components["ISO_3166-1_alpha-3"]
                    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lng
                        + '&appid=' + this.weatherKey + '&units=metric')
                        .then(
                            resp => this.respToJSON(resp)
                        )
                        .then(json => {
                            const location = city + ', ' + countryAbb
                            this.createCard(location, json)
                        })
                        .catch(error => {
                            console.log(error)
                        });
                }
            })
            .catch(error => {
                console.log(error)
            });
    }

    respToJSON = resp => {
        if (!resp.ok) {//ine ako 200
            return (resp.statusText + " " + resp.status)
        } else {
            return resp.json()
        }
    }

    createCard(location, json) {
        const conditions = json.current.weather[0].description
        const icon = json.current.weather[0].icon
        const temperature = Math.round(json.current.temp) + ' °C'

        const card = document.createElement('div')
        const cardBody = document.createElement('div')
        const locationElement = document.createElement('p')
        const iconElement = document.createElement('img')
        const temperatureElement = document.createElement('p')
        const conditionsElement = document.createElement('p')

        card.className = "card"
        cardBody.className = "card-body text-center "
        locationElement.textContent = location
        iconElement.src = 'http://openweathermap.org/img/wn/' + icon + '@2x.png'
        iconElement.className = "weather-icon"
        temperatureElement.textContent = temperature
        conditionsElement.textContent = conditions

        cardBody.append(locationElement,iconElement,temperatureElement,conditionsElement)
        card.appendChild(cardBody)
        
        document.getElementById("cards-row").appendChild(card)
    }


}
