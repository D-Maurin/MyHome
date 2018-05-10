//--------------------Bibliothèques--------------------//

#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <OneWire.h> // Inclusion de la librairie OneWire
//--------------------Initialisation des différentes variables--------------//

#define ESP_ID "ESP_S_0001"

//Define Network
#define AP_SSID "NetworkESP"
#define AP_PASSWD "espconnect"

#define HOST "192.168.4.1"
#define PORT "5000"
#define REPORT_INTERVAL 30000

ESP8266WiFiMulti WiFiMulti;

//--------- Température --------//
#define DS18B20 0x28 // Adresse 1-Wire du DS18B20
#define BROCHE_ONEWIRE 2 // Broche utilisée pour le bus 1-Wire
OneWire ds(BROCHE_ONEWIRE); // Création de l'objet OneWire ds
float brute;
float brute2;

//------------------Setup---------------------//

void setup() {
  Serial.begin(115200);
  Serial.println();
  
  Serial.println("Setting up ...");
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(AP_SSID, AP_PASSWD);//Initialisation des paramètres wifi, connexion 

}

void loop() {
  //float temperature = get_temperature();
  float temp;
// Lit la température ambiante à ~1Hz
if (get_temperature(&temp)){ //Si on arrive a mesurer la température...
  
// Affiche la température
Serial.print("brute : ");
Serial.print(brute);Serial.print(" ou ");Serial.println(brute2);
Serial.print("Temperature : ");
Serial.print(temp);
Serial.write(176); // caractère °
Serial.write('C');
Serial.println();
     
  report_temp(temp);//...on envoie une requête avec la température mesuré
  delay(REPORT_INTERVAL);
 // temp = 0;
}
}


//-----------------Fonction Temp ------------//

boolean get_temperature(float *temp){
  
byte data[9], addr[8];
                                      // data : Données lues depuis le scratchpad
                                      // addr : adresse du module 1-Wire détecté
if (!ds.search(addr)) {               // Recherche un module 1-Wire
ds.reset_search();                    // Réinitialise la recherche de module
return false;                         // Retourne une erreur
}

if (OneWire::crc8(addr, 7) != addr[7]) // Vérifie que l'adresse a été correctement reçue
return false;                         // Si le message est corrompu on retourne une erreur
if (addr[0] != DS18B20)               // Vérifie qu'il s'agit bien d'un DS18B20
return false;                         // Si ce n'est pas le cas on retourne une erreur
ds.reset();                           // On reset le bus 1-Wire
ds.select(addr);                      // On sélectionne le DS18B20
ds.write(0x44, 1);                    // On lance une prise de mesure de température

delay(1000);                          // Et on attend la fin de la mesure

ds.reset();                           // On reset le bus 1-Wire
ds.select(addr);                      // On sélectionne le DS18B20
ds.write(0xBE);                       // On envoie une demande de lecture du scratchpad

for (byte i = 0; i < 9; i++)          // On lit le scratchpad
data[i] = ds.read();                  // Et on stock les octets reçus
brute= data[1] << 8 | data[0];
brute2= data[1] << 8 + data[0];
                                      // Calcul de la température en degré Celsius

*temp = (((data[1] << 8) | data[0]) * 0.0625)+0.0000111111;
                                      // Pas d'erreur
return true;
}

//------------------Fonction d'envoie de requête---------------------//
void report_temp(float temp){
 String url = "http://" + String(HOST) + ":" + String(PORT) + "/report_temp/" + String(ESP_ID) + "/" + String(temp);
  
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    HTTPClient http;
    http.begin(url); 

    Serial.print("[REPORT_TEMP] Accessing URL:"); Serial.println(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      Serial.println("[REPORT_TEMP] Success");
      if (httpCode == HTTP_CODE_OK) {
        String payload = http.getString();
      }
    } else {
      Serial.println("[REPORT_TEMP] Fail");
    }
    http.end();
  }
}

