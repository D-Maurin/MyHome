#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>

#define ESP_ID "ESP_W_0001"

//Define Network
#define AP_SSID "NetworkESP"
#define AP_PASSWD "espconnect"

#define HOST "192.168.4.1"
#define PORT "5000"
#define REPORT_INTERVAL 10000

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  Serial.println();
  
  Serial.println("Setting up ...");
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(AP_SSID, AP_PASSWD);

  pinMode(2, INPUT);
}

void loop() {
  bool winstate = get_window_state();
  report_temp(winstate);
  delay(REPORT_INTERVAL);
}

bool get_window_state(){
  bool winstate = digitalRead(2);
  return winstate;
}


void report_temp(bool winstate){
  String url = "http://" + String(HOST) + ":" + String(PORT) + "/report_window/" + String(ESP_ID) + "/" + String(winstate);
  
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

