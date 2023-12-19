const moduleName = "ItemStorage";
const itemStorageFile = "./data/items.json";
export const items = new Set();

if (FileLib.exists(moduleName, itemStorageFile)) {
  JSON.parse(FileLib.read(moduleName, itemStorageFile)).forEach((it) =>
    items.add(JSON.stringify(it))
  );
} else {
  FileLib.write(moduleName, itemStorageFile, "[]", true);
}

/**
 * @param {string} nbt
 */
function getItemFromNbtString(nbt) {
  return new Item(net.minecraft.item.ItemStack.fromNbt(NBT.parse(JSON.parse(nbt)).toMC()));
}

/**
 * @returns {Item[]}
 */
export function getItemArray() {
  const arr = [];
  items.forEach((it) => arr.push(getItemFromNbtString(it)));
  return arr;
}

export function save() {
  const data = [];
  items.forEach((it) => data.push(JSON.parse(it)));
  FileLib.write(moduleName, itemStorageFile, JSON.stringify(data));
}

/**
 * @param {Item | net.minecraft.item.ItemStack} item
 */
export function storeItem(item) {
  if (!item) return;

  if (item instanceof net.minecraft.item.ItemStack) {
    if (item.getItem() == net.minecraft.item.Items.AIR) return;
    item = new Item(item);
  }

  if (!item.toMC().hasNbt()) return;

  const data = {
    id: item.getType().getRegistryName(),
    Count: 1,
    tag: item.getNBT().toObject(),
  };

  items.add(JSON.stringify(data));
}

export function scanForItems() {
  Player.getInventory()
    ?.getItems()
    ?.concat(Player.getPlayer()?.getArmorItems())
    ?.forEach((item) => storeItem(item));

  World.getAllEntities()?.forEach((it) => {
    const entity = it.toMC();

    entity?.getArmorItems()?.forEach((it) => storeItem(it));
    entity?.getHandItems()?.forEach((it) => storeItem(it));
    entity?.getItemsEquipped()?.forEach((it) => storeItem(it));

    if (entity instanceof net.minecraft.entity.decoration.ItemFrameEntity) {
      storeItem(entity.getHeldItemStack());
    }

    if (entity instanceof net.minecraft.entity.ItemEntity) {
      storeItem(entity.getStack());
    }

    if (entity instanceof net.minecraft.entity.decoration.DisplayEntity$ItemDisplayEntity) {
      storeItem(entity.getStackReference(0).get());
    }
  });
}
