export interface PassiveUnitEffect {
    name:string;
    targets?:string[];//"own"/"self", "friend", "enemy", "neutral"
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
    flatMovement?:string[];
    counterfireMod?:number;
    counterFirst?:boolean;
    captureRateMod?:number;
    unitCostMod?:number;
    hiddenHitPoints?:boolean;
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
    resupply?:boolean;
    halveFuel?:boolean;
    makeActive?:boolean;
    stunDuration?:number;
}

export interface PassiveTerrainEffect {
    name:string;
    targets?:string[];
    affects?:string[];
    terrainRequired?:string[];
    incomeMod?:number;
    incomeFlatMod?:number;
    buildListMod?:string[];
    repairMod?:number;
    occludesVisionMod?:boolean;
    visionModBoost?:number;
    classificationRequired?:string[];
    buildCostMod?:number;
}

export interface ActiveTerrainEffect {
    name:string;
    targets?:string[];
    affects?:string[];
    terrainRequired?:string[];
    unitSummoned?:{
        name:string;
        initialDamage:number;
        active:boolean;
    };
}

export interface PassiveGlobalEffect {
    name:string;
    targets?:string[];
    variantMod?:string;
    variantHintMod?:{[k:string]:number};
    movementClassVariantReplace?:string;
    movementClassVariantOverride?:string;
}

export interface ActiveGlobalEffect {
    name:string;
    targets?:string[];
    fundMod?:number;
    fundFlatMod?:number;
    powerBarMod?:number;
    powerBarPerFunds?:number;
    missileLaunch?:{
        count:number;
        targetMethod:string[];
        damage:number;
        range:number;
        stunDuration?:number;
    }[];
}