//--------------------Bibliothèques--------------------//
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <Servo.h>
#include <ArduinoJson.h>
//--------------------Initialisation des différentes variables--------------//
#define ESP_ID "ESP_R_0001"

//Define Network
#define AP_SSID "NetworkESP"
#define AP_PASSWD "espconnect"

#define HOST "192.168.4.1"
#define PORT "5000"
#define REPORT_INTERVAL 10000

ESP8266WiFiMulti WiFiMulti;

// Le tuple 
float r_temp_s = 20;
float r_temp_target = 20;
int r_window = 0;

#define HYSTERESIS 0.5

Servo Servo_0001;

//------------------Setup---------------------//

void setup() {
  Serial.begin(115200);
  Serial.println();
  Servo_0001.attach(2); //Servo sur le gpio2
  
  Serial.println("Setting up ...");
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(AP_SSID, AP_PASSWD);//Initialisation des paramères wifi, connexion 
}

void loop() {
  ask_temp();// on fait une requête au serveur ESP en demandant températures, température cible, etat de la fenetre
  calculating();//on associe la différence de température à une "puissance" donné par l'angle du servo
  delay(REPORT_INTERVAL);

}




void ask_temp(){
 String url = "http://" + String(HOST) + ":" + String(PORT) + "/get_temps/" + String(ESP_ID) ;
  
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    HTTPClient http;
    http.begin(url); 

    Serial.print("[ASK_TEMP] Accessing URL:"); Serial.println(url);
    int httpCode = http.GET();

    if (httpCode > 0) {         //On regarde si la requête a bien aboutit
      Serial.println("[ASK_TEMP] Success");
      String payload = http.getString();
      Serial.println(payload);

      DynamicJsonBuffer jsonBuffer;
      JsonArray& root = jsonBuffer.parse(payload);

      r_temp_s = root[0];//température de la pièce
      r_temp_target = root[1];//température cible
      r_window = root[2];//etat de la fenêtre

      Serial.print("[ASK_RESPOND]");
      
    } else {
      Serial.println("[ASK_TEMP] Fail");
    }
    http.end();
  }
}



int calculating()
{
  float gap = (r_temp_target - r_temp_s);

  if (r_temp_s < (r_temp_target - HYSTERESIS) && r_window = 0) {
    if (gap >= 5){
      Servo_0001.write(180); // si la différence est trop grande (> 5), on met le radiateur à fond
      Serial.print(String(180));Serial.println(" degree");
    }
    else {
      float val = map(gap, 0, 5,0, 180);
      Servo_0001.write(val);// sinon on associe l'écart à un angle
      Serial.print(String(val)); Serial.println(" degree");
    }
  }else if(r_temp_s > (r_temp_target + HYSTERESIS)){
    Servo_0001.write(0); //
    Serial.print(String(0));Serial.println(" degree");
    
  }
  
}

