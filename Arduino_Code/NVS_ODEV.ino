#include <Preferences.h>

Preferences preferences;
// wifi connect ----------------------------------------------------

void setup() {
  Serial.begin(115200);
  Serial.println();
  preferences.begin("oys", false);


  preferences.putString("classID", "C107");
  preferences.putString("ssid", "yourssid");
  preferences.putString("password", "yourpassword");

  
  String classID = preferences.getString("classID", "undefined");
  String ssid = preferences.getString("ssid", "undefined");
  String password = preferences.getString("password", "undefined");
  Serial.println(classID);
  Serial.println(ssid);
  Serial.println(password);

  preferences.end();

  Serial.println("Restarting in 10 seconds...");
  delay(10000);

  ESP.restart();
}

void loop() {}
