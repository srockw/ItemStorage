import * as Menu from "./menu";
import * as Storage from "./storage";
import { clearArgumentType, maxPagesArgumentType } from "./types";

register("packetReceived", (packet) => {
  if (packet instanceof net.minecraft.network.packet.s2c.play.InventoryS2CPacket) {
    packet.getContents().forEach((it) => Storage.storeItem(it));
  }

  if (packet instanceof net.minecraft.network.packet.s2c.play.ScreenHandlerSlotUpdateS2CPacket) {
    Storage.storeItem(packet.getStack());
  }

  if (packet instanceof net.minecraft.network.packet.s2c.play.EntityTrackerUpdateS2CPacket) {
    packet.trackedValues().forEach((it) => {
      if (it.value() instanceof net.minecraft.item.ItemStack) {
        Storage.storeItem(it.value());
      }
    });
  }

  if (packet instanceof net.minecraft.network.packet.s2c.play.SetTradeOffersS2CPacket) {
    packet.getOffers().forEach((it) => {
      Storage.storeItem(it.getOriginalFirstBuyItem());
      Storage.storeItem(it.getSecondBuyItem());
      Storage.storeItem(it.getSellItem());
    });
  }

  if (packet instanceof net.minecraft.network.packet.s2c.play.GameMessageS2CPacket) {
    packet
      .content()
      .getWithStyle(net.minecraft.text.Style.EMPTY)
      .forEach((it) => {
        const hoverEvent = it.getStyle()?.getHoverEvent();
        if (hoverEvent)
          Storage.storeItem(
            hoverEvent.getValue(net.minecraft.text.HoverEvent$Action.SHOW_ITEM)?.asStack()
          );
      });
  }

  if (packet instanceof net.minecraft.network.packet.s2c.play.AdvancementUpdateS2CPacket) {
    packet.getAdvancementsToEarn().forEach((it) => {
      const display = it.value()?.display();
      if (!display?.isEmpty()) Storage.storeItem(display.get().getIcon());
    });
  }
});

Commands.registerCommand("itemstorage", () => {
  const { literal, exec, argument, itemPredicate, greedyString } = Commands;

  literal("scan", () => {
    exec(() => Storage.scanForItems());
  });

  literal("view", () => {
    literal("page", () => {
      argument("page", maxPagesArgumentType, () => {
        exec(({ page }) => {
          Menu.setItems(Storage.getItemArray());
          Menu.setPage(page - 1);
        });
      });
    });

    literal("search", () => {
      literal("name", () => {
        argument("name", greedyString(), () => {
          exec(({ name }) => {
            Menu.setItems(
              Storage.getItemArray().filter((it) =>
                it.getName().toLowerCase().includes(name.toLowerCase())
              )
            );
          });
        });
      });

      literal("id", () => {
        argument("item", itemPredicate(), () => {
          exec(({ item }) => {
            Menu.setItems(Storage.getItemArray().filter((it) => item.invoke(it)));
          });
        });
      });
    });

    exec(() => {
      Menu.setItems(Storage.getItemArray());
    });
  });

  literal("clear", () => {
    argument("confirmation", clearArgumentType, () => {
      exec(() => {
        new TextComponent("Cleared ALL the items.").setColor(0xff000f).chat();
        Storage.items.clear();
      });
    });
  });

  literal("save", () => {
    exec(() => {
      Storage.save();
      ChatLib.chat("&aSaved items.");
    });
  });
});

// Autosave on game quit
register("gameUnload", () => Storage.save());
// Autosave every 5 minutes
register("step", () => new Thread(() => Storage.save()).start()).setDelay(300);

// Automatically scan for items every 15 seconds
register("step", () => new Thread(() => Storage.scanForItems()).start()).setDelay(15);
