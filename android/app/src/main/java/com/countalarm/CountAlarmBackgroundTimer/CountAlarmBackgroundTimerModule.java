package com.countalarm.CountAlarmBackgroundTimer;

import android.widget.Toast;
import android.app.AlarmManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;

public class CountAlarmBackgroundTimerModule extends ReactContextBaseJavaModule {
  public CountAlarmBackgroundTimerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "CountAlarmBackgroundTimer";
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

  @ReactMethod
  public void createAlarm(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }
}





