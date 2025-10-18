# BSides Perth 2025 Badge

## Physical Badge

Instructions on how to assemble the physical badge can be found [here](docs/AssemblyInstructions.md)

If a re-download of the physical badge is required, follow these [instructions](docs/DownloadInstructions.md). This will be required if you wish to attempt the online challenges (see Known Issues below).

### Parts List

| Qty | Item | Link | Alternative Link |
| 4	| 6x6x6mm Push Button Tactile Switch | https://a.aliexpress.com/_mtKEuoZ || 
| 4	| 10k 1/4W 1% Metal Film Resistor | https://a.aliexpress.com/_m0tmaNF ||
| 1	| 1x4 2.54mm Male Header Pin Connector | https://a.aliexpress.com/_mLn1ap7 ||
| 1	| 1x8 2.54mm Female Header Pin Connector | https://a.aliexpress.com/_mquvebf | https://a.aliexpress.com/_mNltGYh |
| 1	| 1x4 2.54mm Female Header Pin Connector | https://a.aliexpress.com/_mquvebf | https://a.aliexpress.com/_mNltGYh |
| 2	| 1x15 2.54mm Female Header Pin Connector | https://a.aliexpress.com/_mquvebf | https://a.aliexpress.com/_mNltGYh |
| 1	| 2x3 2.54mm Femal Header Pin Connector	| https://a.aliexpress.com/_mK6bxvJ ||
| 1	| ESP32 DOIT DevKit v1 - 30Pin | https://a.aliexpress.com/_mr7LSPJ ||
| 1	| 1.8" LCD TFT Display | https://a.aliexpress.com/_mPspKyp ||

## Virtual Badge

The virtual badge can be accessed here: https://badge.bsidesperth.com.au/

The code for the Virtual Badge code can be found in this repository under "VirtualBadge".

The virtual badge does not support "Online Challenges", but does contain hidden features such as a second episode, cheats, and an easter egg.

## Physical Badge Code Template

There is a basic template for an Arduino program under the folder "Template". The template demonstrates basic use of the LCD screen, ESP32, and button inputs. The download instructions can be found [here](docs/DownloadInstructions.md).

## Virtual Badge Server (API for Online Challenges)

Code for the Virtual Badge Server (API for Online Challenges) will be made available ~1st November 2025.

## Badge Holder (3D Print)

A badge holder can be 3D printed using an off-the-shelf 3D printer. Recommended print settings are PLA plastic, 60+% infill, 40mm/s print speed. Some stringing may occur if filament is damp and/or print speed is too high.

![](/BadgeHolder_3DPrint/Screenshot1.png) ![](/BadgeHolder_3DPrint/Screenshot4.png)

## Customisation

Customisation of the virtual and physical badge are both possible. Extra details can be found [here](docs/Customisation.md)

## Known Issues

- To play the Online Challenges on a ESP32 supplied in a component pack, a re-download of the physical badge code to the ESP32 is required. [Fixed]
- Online Challenges were unavailable (18th Oct) due to firewall issue. This has since been resolved. [Fixed]
- Offline Challenges now generates sequences which use all four buttons (only three buttons were being used in the original code). [Fixed]

## Like the game/badge?

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/badges4dotcom)