#ifndef LED_FUNCTIONS_H
#define LED_FUNCTIONS_H
#include <Arduino.h>


class led_functions{
  public:
    led_functions(byte pin1);
    void power_on_led();
    void power_off_led();
    void power_time_led(int time);
  private:
    byte _pin1;
};

#endif