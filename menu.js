import { ChestMenu } from "../ChestMenu";

const NextPageItem = new ItemType("arrow").asItem().setName(new TextComponent("&aNext Page"));
const PrevPageItem = new ItemType("arrow").asItem().setName(new TextComponent("&aPrevious Page"));

const GoToPageItem = new ItemType("writable_book")
  .asItem()
  .setName(new TextComponent("&eGo to Page"));

const SearchItem = new ItemType("recovery_compass")
  .asItem()
  .setName(new TextComponent("&eSearch Item"));

const SearchNameItem = new ItemType("paper")
  .asItem()
  .setName(new TextComponent("&eSearch by Name"));

const EmptyItem = new ItemType("black_stained_glass_pane")
  .asItem()
  .setName(new TextComponent("&b"));

const data = {
  currentPage: 0,
  items: [],
  maxPages: 1,
};

/**
 * @param {Item} item1
 * @param {Item} item2
 */
function compareItems(item1, item2) {
  return (
    item1.getNBT().toMC().equals(item2.getNBT().toMC()) &&
    item1.getType().getRegistryName() == item2.getType().getRegistryName()
  );
}

function getLastRow() {
  const row = new Array(9).fill(EmptyItem);
  row[3] = GoToPageItem;
  row[5] = SearchItem;
  row[6] = SearchNameItem;

  if (data.maxPages > data.currentPage + 1) {
    row[8] = NextPageItem;
  }

  if (data.currentPage > 0) {
    row[0] = PrevPageItem;
  }

  return row;
}

function getEmptySlot() {
  const slot = Player.getPlayer().getInventory().getEmptySlot();
  if (slot < 9) return slot + 36;
  return slot;
}

export const itemMenu = new ChestMenu("Item Storage", 6);

itemMenu.onClick((item, slot) => {
  if (!item) return;

  if (compareItems(item, NextPageItem)) movePage(1);
  else if (compareItems(item, PrevPageItem)) movePage(-1);
  else if (compareItems(item, GoToPageItem))
    Client.setCurrentChatMessage("/itemstorage view page ");
  else if (compareItems(item, SearchItem))
    Client.setCurrentChatMessage("/itemstorage view search id ");
  else if (compareItems(item, SearchNameItem))
    Client.setCurrentChatMessage("/itemstorage view search name ");
  else if (slot.getIndex() >= 0 && slot.getIndex() < 45) {
    if (!Player.getPlayer().isCreative())
      return ChatLib.chat("&cYou need to be in creative to spawn an item!");
    
    const newSlot = getEmptySlot();
    Player.getPlayer().playerScreenHandler.getSlot(newSlot).setStack(item.toMC());
    Client.getMinecraft().interactionManager.clickCreativeStack(item.toMC(), newSlot);
  }
});

/**
 * @param {Item[]} items
 */
export function setItems(items, openAfter = true) {
  data.items = items;
  data.maxPages = Math.ceil(items.length / 45);
  data.currentPage = data.maxPages - 1;
  reloadPage();

  if (openAfter) open();
}

/**
 * @param {number} offset
 */
export function movePage(offset) {
  data.currentPage = MathLib.clamp(data.currentPage + offset, 0, data.maxPages - 1);
  reloadPage();
}

/**
 * @param {number} page
 */
export function setPage(page) {
  data.currentPage = MathLib.clamp(page, 0, data.maxPages - 1);
  reloadPage();
}

export function reloadPage() {
  const offset = data.currentPage * 45;
  const newItems = [];

  data.items.forEach((it, index) => {
    if (index < offset || newItems.length >= 45) return;
    newItems.push(it);
  });

  while (newItems.length < 45) {
    newItems.push(null);
  }

  itemMenu.setName(
    data.maxPages > 0
      ? `Item Storage (${data.currentPage + 1}/${data.maxPages})`
      : "Item Storage (Empty)"
  );
  itemMenu.setItems(newItems.concat(getLastRow()));
}

export function open() {
  itemMenu.open();
}
