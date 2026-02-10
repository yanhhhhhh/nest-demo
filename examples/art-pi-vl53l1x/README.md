# ART-Pi VL53L1X-v2 Example

This directory contains a complete implementation example for using the VL53L1X-v2 Time-of-Flight sensor with ART-Pi and RT-Thread.

## Overview

The VL53L1X is a laser-ranging sensor that uses Time-of-Flight (ToF) technology to measure distances up to 4 meters with high accuracy.

## Features

- I2C communication with VL53L1X sensor
- Support for short-range (up to 1.3m) and long-range (up to 4m) modes
- Configurable timing budgets (15ms to 500ms)
- Simple API for distance measurement
- MSH shell commands for testing

## Hardware Requirements

- **Board**: ART-Pi (STM32H750XBH6)
- **Sensor**: VL53L1X-v2 ToF sensor module
- **Connections**:
  - VDD → 3.3V
  - GND → GND
  - SCL → PB10 (I2C2_SCL)
  - SDA → PB11 (I2C2_SDA)

## File Structure

```
art-pi-vl53l1x/
├── README.md              # This file
├── vl53l1x.h              # Main driver header
├── vl53l1x.c              # Main driver implementation
├── vl53l1x_platform.h     # Platform I2C abstraction header
├── vl53l1x_platform.c     # Platform I2C implementation
└── application.c          # Example application code
```

## Quick Start

### 1. RT-Thread Configuration

Enable I2C2 in your RT-Thread project:

```c
// In rtconfig.h
#define BSP_USING_I2C
#define BSP_USING_I2C2

// In board.h
#define BSP_I2C2_SCL_PIN    GET_PIN(B, 10)
#define BSP_I2C2_SDA_PIN    GET_PIN(B, 11)
```

### 2. Add Source Files

Copy all `.c` and `.h` files from this directory to your RT-Thread project.

### 3. Build and Flash

Build the project in RT-Thread Studio and flash to ART-Pi.

### 4. Test

Open MSH terminal and run:

```bash
# Single test
msh> vl53l1x_test

# Continuous ranging
msh> vl53l1x_start
```

## API Reference

### Initialization

```c
vl53l1x_device_t dev;
vl53l1x_init(&dev, "i2c2");
```

### Start Ranging

```c
vl53l1x_start_ranging(&dev);
```

### Read Distance

```c
rt_uint16_t distance;
if (vl53l1x_data_ready(&dev)) {
    vl53l1x_get_distance(&dev, &distance);
    rt_kprintf("Distance: %d mm\n", distance);
}
```

### Configuration

```c
// Set distance mode
vl53l1x_set_distance_mode(&dev, VL53L1X_DISTANCE_MODE_LONG);

// Set timing budget
vl53l1x_set_timing_budget(&dev, VL53L1X_TIMING_BUDGET_100MS);
```

### Stop and Cleanup

```c
vl53l1x_stop_ranging(&dev);
vl53l1x_deinit(&dev);
```

## Distance Modes

| Mode | Range | Best For |
|------|-------|----------|
| SHORT | Up to 1.3m | High ambient light, precise short-range |
| LONG | Up to 4m | Low ambient light, longer distances |

## Timing Budgets

Available timing budgets: 15ms, 20ms, 33ms, 50ms, 100ms, 200ms, 500ms

- **Shorter budgets**: Faster measurements, lower accuracy
- **Longer budgets**: Slower measurements, higher accuracy

## Troubleshooting

### Sensor Not Detected

1. Check hardware connections
2. Verify I2C2 is enabled in configuration
3. Run `i2c probe i2c2` in MSH shell
4. Check pull-up resistors on I2C lines (4.7kΩ recommended)

### Incorrect Readings

1. Ensure proper power supply (3.3V)
2. Check for reflective or transparent surfaces
3. Adjust distance mode and timing budget
4. Verify sensor initialization completed successfully

### Compilation Errors

1. Ensure all source files are added to project
2. Check that I2C device driver is enabled in RT-Thread
3. Verify `#include <rtdevice.h>` is present

## Performance Tips

1. **For fastest measurements**: Use SHORT mode with 15ms timing budget
2. **For longest range**: Use LONG mode with 200ms timing budget
3. **For balanced performance**: Use LONG mode with 100ms timing budget
4. **For high accuracy**: Use longer timing budgets (200ms+)

## Advanced Features (Not Implemented)

The following features are available in ST's full VL53L1X API but not implemented in this simplified example:

- ROI (Region of Interest) configuration
- Offset calibration
- Cross-talk calibration
- Multi-object detection
- Signal and ambient rate measurements

For production applications, consider integrating the full ST VL53L1X ULD API.

## References

- [VL53L1X Datasheet](https://www.st.com/resource/en/datasheet/vl53l1x.pdf)
- [ART-Pi Documentation](https://art-pi.gitee.io/website/)
- [RT-Thread I2C Guide](https://www.rt-thread.org/document/site/)

## License

This example code is provided as-is for educational and development purposes.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the complete guide in `notes/ART-Pi-RTThread/`
3. Open an issue in the repository

---

Happy ranging! 🎯
