// Making a list of all the specific items i need to fetch and split them into categories

export const ITEM_LIST = [

  // --------- armor -----------

  {index: "armor-of-invulnerability", type: "magic-items", category: "Armor"},
  {index: "arrow-catching-shield", type: "magic-items", category: "Armor"},
  {index: "demon-armor", type: "magic-items", category: "Armor"},
  {index: "dwarven-plate", type: "magic-items", category: "Armor"},
  {index: "glamoured-studded-leather-armor", type: "magic-items", category: "Armor"},
  {index: "shield-of-missile-attraction", type: "magic-items", category: "Armor"},
  {index: "adamantine-armor", type: "magic-items", category: "Armor"},
  {index: "armor-3", type: "magic-items", category: "Armor"},
  {index: "animated-shield", type: "magic-items", category: "Armor"},
  {index: "dragon-scale-mail", type: "magic-items", category: "Armor"},


  // --------- weapons -----------

  {index: "dragon-slayer", type: "magic-items", category: "Weapon"},
  {index: "dwarven-thrower", type: "magic-items", category: "Weapon"},
  {index: "frost-brand", type: "magic-items", category: "Weapon"},
  {index: "berserker-axe", type: "magic-items", category: "Weapon"},
  {index: "hammer-of-thunderbolts", type: "magic-items", category: "Weapon"},
  {index: "dagger-of-venom", type: "magic-items", category: "Weapon"},
  {index: "dancing-sword", type: "magic-items", category: "Weapon"},
  {index: "sword-of-life-stealing", type: "magic-items", category: "Weapon"},
  {index: "nine-lives-stealer", type: "magic-items", category: "Weapon"},
  {index: "mace-of-terror", type: "magic-items", category: "Weapon"},
  {index: "luck-blade", type: "magic-items", category: "Weapon"},
  {index: "javelin-of-lightning", type: "magic-items", category: "Weapon"},
  {index: "holy-avenger", type: "magic-items", category: "Weapon"},
  {index: "scimitar-of-speed", type: "magic-items", category: "Weapon"},
  {index: "sun-blade", type: "magic-items", category: "Weapon"},
  {index: "trident-of-fish-command", type: "magic-items", category: "Weapon"},
  {index: "vicious-weapon", type: "magic-items", category: "Weapon"},
  {index: "oathbow", type: "magic-items", category: "Weapon"},


  // --------- tools -----------

  {index: "alchemists-supplies", type: "equipment", category: "Tool"},
  {index: "brewers-supplies", type: "equipment", category: "Tool"},
  {index: "calligraphers-supplies", type: "equipment", category: "Tool"},
  {index: "carpenters-tools", type: "equipment", category: "Tool"},
  {index: "cartographers-tools", type: "equipment", category: "Tool"},
  {index: "cooks-utensils", type: "equipment", category: "Tool"},
  {index: "glassblowers-tools", type: "equipment", category: "Tool"},
  {index: "jewelers-tools", type: "equipment", category: "Tool"},
  {index: "masons-tools", type: "equipment", category: "Tool"},
  {index: "dice-set", type: "equipment", category: "Tool"},
  {index: "playing-card-set", type: "equipment", category: "Tool"},


  // --------- instruments -----------

  {index: "flute", type: "equipment", category: "Instrument"},
  {index: "lyre", type: "equipment", category: "Instrument"},
  {index: "drum", type: "equipment", category: "Instrument"},
  {index: "bagpipes", type: "equipment", category: "Instrument"},
  {index: "lute", type: "equipment", category: "Instrument"},
  {index: "horn", type: "equipment", category: "Instrument"},
  {index: "viol", type: "equipment", category: "Instrument"},


  // --------- potions -----------

  {index: "potion-of-clairvoyance", type: "magic-items", category: "Potion"},
  {index: "potion-of-climbing", type: "magic-items", category: "Potion"},
  {index: "potion-of-flying", type: "magic-items", category: "Potion"},
  {index: "potion-of-growth", type: "magic-items", category: "Potion"},
  {index: "potion-of-invisibility", type: "magic-items", category: "Potion"},
  {index: "potion-of-mind-reading", type: "magic-items", category: "Potion"},
  {index: "potion-of-poison", type: "magic-items", category: "Potion"},
  {index: "potion-of-speed", type: "magic-items", category: "Potion"},
  {index: "potion-of-healing-common", type: "magic-items", category: "Potion"},
  {index: "potion-of-healing-greater", type: "magic-items", category: "Potion"},
  {index: "potion-of-healing-superior", type: "magic-items", category: "Potion"},
  {index: "potion-of-healing-supreme", type: "magic-items", category: "Potion"},


  // --------- scrolls -----------

  {index: "spell-scroll-cantrip", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-1st", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-2nd", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-3rd", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-4th", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-5th", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-6th", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-7th", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-8th", type: "magic-items", category: "Scroll"},
  {index: "spell-scroll-9th", type: "magic-items", category: "Scroll"},


  // --------- wondrous items -----------

  {index: "amulet-of-health", type: "magic-items", category: "Wondrous Item"},
  {index: "bag-of-beans", type: "magic-items", category: "Wondrous Item"},
  {index: "bag-of-holding", type: "magic-items", category: "Wondrous Item"},
  {index: "belt-of-giant-strength", type: "magic-items", category: "Wondrous Item"},
  {index: "boots-of-speed", type: "magic-items", category: "Wondrous Item"},
  {index: "broom-of-flying", type: "magic-items", category: "Wondrous Item"},
  {index: "carpet-of-flying", type: "magic-items", category: "Wondrous Item"},
  {index: "cloak-of-protection", type: "magic-items", category: "Wondrous Item"},
  {index: "crystal-ball", type: "magic-items", category: "Wondrous Item"},
  {index: "cubic-gate", type: "magic-items", category: "Wondrous Item"},
  {index: "deck-of-many-things", type: "magic-items", category: "Wondrous Item"},
  {index: "dust-of-sneezing-and-choking", type: "magic-items", category: "Wondrous Item"},
  {index: "gem-of-brightness", type: "magic-items", category: "Wondrous Item"},
  {index: "hat-of-disguise", type: "magic-items", category: "Wondrous Item"},
  {index: "headband-of-intellect", type: "magic-items", category: "Wondrous Item"},
  {index: "necklace-of-fireballs", type: "magic-items", category: "Wondrous Item"}
];

