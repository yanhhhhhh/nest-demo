# Hardware Setup Guide for ART-Pi and VL53L1X-v2

This guide covers the physical hardware setup for connecting a VL53L1X-v2 Time-of-Flight sensor to the ART-Pi development board.

## Required Components

### 1. ART-Pi Development Board
- **Model**: ART-Pi (ART-π)
- **MCU**: STM32H750XBH6
- **Power**: USB Type-C (5V)

### 2. VL53L1X-v2 Sensor Module
- **Type**: Time-of-Flight (ToF) laser ranging sensor
- **Voltage**: 2.6V - 3.5V (3.3V recommended)
- **Interface**: I2C
- **Package**: Typically comes as a breakout board with pins

### 3. Additional Components
- Jumper wires (4 minimum)
- Breadboard (optional, for prototyping)
- USB Type-C cable for ART-Pi

## Pin Connections

### Connection Diagram

```
VL53L1X-v2          ART-Pi Board
┌─────────┐         ┌──────────┐
│         │         │          │
│  VDD  ●─┼─────────┼→ 3.3V    │
│         │         │          │
│  GND  ●─┼─────────┼→ GND     │
│         │         │          │
│  SCL  ●─┼─────────┼→ PB10    │ (I2C2_SCL)
│         │         │          │
│  SDA  ●─┼─────────┼→ PB11    │ (I2C2_SDA)
│         │         │          │
│ [XSHUT]●│         │ (GPIO)*  │ Optional
│         │         │          │
│ [GPIO1]●│         │ (GPIO)*  │ Optional
│         │         │          │
└─────────┘         └──────────┘

* Optional connections for advanced features
```

### Detailed Pin Mapping

| VL53L1X-v2 Pin | Function | Connect to ART-Pi | Notes |
|----------------|----------|-------------------|-------|
| VDD | Power Supply | 3.3V | **Required** |
| GND | Ground | GND | **Required** |
| SCL | I2C Clock | PB10 (I2C2_SCL) | **Required** |
| SDA | I2C Data | PB11 (I2C2_SDA) | **Required** |
| XSHUT | Shutdown Control | Any GPIO | Optional - leave floating or pull high |
| GPIO1 | Interrupt Output | Any GPIO | Optional - for interrupt-driven operation |

## Step-by-Step Connection

### Step 1: Power Off
Ensure the ART-Pi board is **disconnected** from power before making any connections.

### Step 2: Connect Power Lines

1. **Connect VDD**: 
   - VL53L1X-v2 VDD → ART-Pi 3.3V pin
   - Use a short, reliable jumper wire
   - Ensure good contact

2. **Connect GND**: 
   - VL53L1X-v2 GND → ART-Pi GND pin
   - Critical for proper operation
   - Use a short wire to minimize noise

### Step 3: Connect I2C Lines

3. **Connect SCL**:
   - VL53L1X-v2 SCL → ART-Pi PB10
   - This is the I2C clock line
   - Keep wire length under 15cm for best reliability

4. **Connect SDA**:
   - VL53L1X-v2 SDA → ART-Pi PB11
   - This is the I2C data line
   - Keep wire length under 15cm for best reliability

### Step 4: Optional Connections

5. **XSHUT** (optional):
   - If you need to control sensor power-down, connect to a GPIO
   - Otherwise, leave floating or connect to 3.3V
   - Not required for basic operation

6. **GPIO1** (optional):
   - Interrupt output from sensor
   - Connect to a GPIO if using interrupt-driven mode
   - Not required for polling-based operation

### Step 5: Verify Connections

Double-check all connections:
- [ ] VDD connected to 3.3V
- [ ] GND connected to GND
- [ ] SCL connected to PB10
- [ ] SDA connected to PB11
- [ ] No short circuits between pins
- [ ] Connections are secure

## ART-Pi Board Pin Locations

### Finding the Correct Pins

On the ART-Pi board:

1. **3.3V Pin**: Usually marked "3V3" or "3.3V" on the board
2. **GND Pin**: Usually marked "GND" - multiple GND pins available
3. **PB10**: Look for "PB10" or check the board pinout diagram
4. **PB11**: Look for "PB11" or check the board pinout diagram

**Tip**: Consult the [ART-Pi pinout diagram](https://art-pi.gitee.io/website/) for exact pin locations.

## Pull-up Resistors

### Why are they needed?

I2C requires pull-up resistors on both SCL and SDA lines.

### Are they already present?

- **VL53L1X-v2 breakout boards**: Usually include built-in 4.7kΩ pull-ups ✓
- **ART-Pi board**: May have pull-ups on I2C lines (check schematic)

### Do I need to add them?

1. **If using a VL53L1X-v2 breakout module**: Probably NOT needed
2. **If using bare VL53L1X chip**: YES, add 4.7kΩ resistors

### Adding Pull-up Resistors (if needed)

```
         3.3V
          │
    4.7kΩ │  4.7kΩ
    ┌─────┴────┬────┐
    │          │    │
   SCL        SDA   │
    │          │    │
   MCU      Sensor  │
```

Connect:
- One 4.7kΩ resistor between SCL and 3.3V
- One 4.7kΩ resistor between SDA and 3.3V

## Power Supply Considerations

### Voltage Requirements
- VL53L1X-v2 operates at **2.6V - 3.5V**
- Use ART-Pi's **3.3V** output
- **DO NOT** use 5V - it will damage the sensor!

### Current Requirements
- Typical: 20mA
- Peak: 40mA
- ART-Pi 3.3V output can easily supply this

### Power Quality
- Add a 100nF (0.1µF) ceramic capacitor near VL53L1X VDD pin
- Keeps voltage stable during measurements
- Place as close to sensor as possible

```
VL53L1X
  VDD ─┬─ to 3.3V
       │
      ═╧═ 100nF
       │
  GND ─┴─ to GND
```

## Using a Breadboard

### Breadboard Setup

If using a breadboard for prototyping:

```
        ART-Pi                  Breadboard              VL53L1X
      
    3.3V ────────────→ (red rail) ─────────→ VDD
     GND ────────────→ (blue rail) ────────→ GND
    PB10 ────────────→ (row X) ─────────────→ SCL
    PB11 ────────────→ (row Y) ─────────────→ SDA
```

**Tips**:
- Use breadboard power rails for VDD and GND
- Keep I2C wires short and direct
- Avoid crossing I2C wires over noisy signals

## Troubleshooting Hardware Issues

### Sensor Not Detected

**Check**:
1. ✓ VDD connected to 3.3V (NOT 5V!)
2. ✓ GND properly connected
3. ✓ SCL and SDA not swapped
4. ✓ Pull-up resistors present
5. ✓ No loose connections

**Test**:
```bash
# In MSH shell
msh> i2c probe i2c2
```
Should show device at address 0x29.

### Unstable Readings

**Check**:
1. ✓ Wire length < 15cm
2. ✓ Good, tight connections
3. ✓ Add 100nF capacitor near sensor
4. ✓ Avoid running I2C wires parallel to power wires

### No Communication

**Check**:
1. ✓ I2C2 enabled in RT-Thread configuration
2. ✓ Correct pins: PB10 (SCL), PB11 (SDA)
3. ✓ Pull-up resistors present (4.7kΩ)
4. ✓ Sensor receiving power (measure VDD = 3.3V)

## Safety Notes

⚠️ **Important Safety Information**:

1. **Never apply 5V to VL53L1X** - Maximum voltage is 3.6V
2. **Always disconnect power** before changing connections
3. **Check polarity** before connecting power
4. **Avoid static discharge** - touch grounded metal before handling board
5. **Don't short circuit** - be careful with wire placement

## Next Steps

After completing hardware setup:

1. ✓ Power on the ART-Pi board
2. ✓ Follow the [I2C Configuration Guide](./i2c-quick-reference.md)
3. ✓ Build and flash the [VL53L1X example code](../../examples/art-pi-vl53l1x/)
4. ✓ Run `vl53l1x_test` in MSH shell

## References

- [ART-Pi Board Schematic](https://art-pi.gitee.io/website/)
- [VL53L1X-v2 Datasheet](https://www.st.com/resource/en/datasheet/vl53l1x.pdf)
- [I2C Specification](https://www.nxp.com/docs/en/user-guide/UM10204.pdf)

---

Need help? See the [main guide](./README.md) or open an issue in the repository.
