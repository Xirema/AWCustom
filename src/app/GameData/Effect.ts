export interface PassiveUnitEffect {
    name:string;
    targets?:string[];
    unitTypeRequired?:string[];
    classificationRequired?:string[];
    terrainRequired?:string[];
    firepowerMod?:number;
    defenseMod?:number;
    indirectDefenseMod?:number;
    minRangeMod?:number;
    maxRangeMod?:number;
    fuelUseMod?:number;
    ammoUseMod?:number;
    goodLuckMod?:number;
    badLuckMod?:number;
    movementMod?:number;
    visionMod?:number;
    terrainStarsMod?:number;
    terrainStarsFlatMod?:number;
    terrainStarsDefense?:number;
    terrainStarsFirepower?:number;
    counterfireMod?:number;
    counterFirst?:boolean;
    captureRateMod?:number;
    unitCostMod?:number;
    hiddenHitPoints?:string[];
    luckPointsVisible?:string[];
    hpPartVisible?:string[];
    firepowerFromFunds?:number;
    defenseFromFunds?:number;
    fundsFromDamage?:number;
    firepowerFromOwnedTerrain?:{[k:string]:number};
    defenseFromOwnedTerrain?:{[k:string]:number};
    visionVariantMods?:{[k:string]:number};
    firepowerVariantMods?:{[k:string]:number};
    defenseVariantMods?:{[k:string]:number};
    coMeterChargeFromDealtDamage?:number;
    coMeterChargeFromReceivedDamage?:number;
}

export interface ActiveUnitEffect {
    name:string;
    targets?:string[];
    unitTypeRequired?:string[];
    classificationRequired?:string[];
    terrainRequired?:string[];
    hitPointMod?:number;
    roundHitPoints?:number;
    setFuel?:number;
    setAmmo?:number;
    addFuel?:number;
    addAmmo?:number;
    multiplyFuel?:number;
    multiplyAmmo?:number;
    makeActive?:boolean;
    stunDuration?:number;
    coChargeFactor?:number;
}

export interface PassiveTerrainEffect {
    name:string;
    targets?:string[];
    affects?:string[];
    terrainRequired?:string[];
    classificationRequired?:string[];
    incomeMod?:number;
    incomeFlatMod?:number;
    buildListMod?:string[];
    repairMod?:number;
    occludesVisionMod?:boolean;
    visionModBoost?:number;
    buildCostMod?:number;
}

export interface ActiveTerrainEffect {
    name:string;
    targets?:string[];
    affects?:string[];
    terrainRequired?:string[];
    unitSummonedName?:string;
    unitSummonedInitialDamage?:number;
    unitSummonedActive?:boolean;
}

export interface PassiveGlobalEffect {
    name:string;
    targets?:string[];
    variantMod?:string;
    variantHintMod?:{[k:string]:number};
    movementClassVariantReplace?:string;
    movementClassVariantOverride?:string;
    minimumVisionMod?:number;
}

export interface ActiveGlobalEffect {
    name:string;
    targets?:string[];
    fundMod?:number;
    fundFlatMod?:number;
    powerBarMod?:number;
    powerBarPerFunds?:number;
    missileCount?:number;
    missileTargetMethod?:string[];
    missileDamage?:number;
    missileAreaOfEffect?:number;
    missileStunDuration?:number;
    coChargeFactor?:number;
}