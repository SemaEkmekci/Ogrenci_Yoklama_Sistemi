#include "led_functions.h"


led_functions::led_functions(byte pin1){
  pinMode(pin1, OUTPUT);
  _pin1 = pin1;
}

void led_functions::power_on_led(){
  digitalWrite(_pin1, HIGH);
}

void led_functions::power_off_led(){
  digitalWrite(_pin1, LOW);
}

void led_functions::power_time_led(int time){
  digitalWrite(_pin1, HIGH);
  delay(time);
  digitalWrite(_pin1, LOW);
  delay(time);
}


