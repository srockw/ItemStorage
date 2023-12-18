# ItemStorage
This module is very heavily inspired by [NBTVoid](https://github.com/White-145/nbtvoid), many thanks to White-145!

It is available for [ChatTriggers](https://github.com/ChatTriggers/ctjs/) in Minecraft 1.19.4 and above.

# Purpose

Similarly to [NBTVoid](https://github.com/White-145/nbtvoid), this module scans for items in your inventory, other entities and screens, then stores them in a local file in your computer.

Unfortunately, I was unable to figure out how to make creative tabs in [ChatTriggers](https://github.com/ChatTriggers/ctjs/), so I did what I thought was best, a GUI based on Minecraft's chests, like ones you'd see on servers such as Hypixel.

![Image of the GUI](https://i.imgur.com/KxHADjf.png)

You may click on items to spawn them in your inventory, this requires you to be in creative mode, and depending on the server you're in, these items may be removed or modified.

# Command

- /itemstorage
  - scan: look for items on all world entities, this is done automatically every 15 seconds

  - view: open the GUI to view all the items
    - page \<page number>: optional argument to specify which page you wish to see

  - search
    - name \<item name>: search for items that include this text on their name

    - id \<item predicate>: search for items depending on their id, you may specify required NBT and more

  - clear \<confirmation>: dangerous command that will delete all stored items, requires typing a confirmation phrase.

  - save: manually save the data, this is done automatically