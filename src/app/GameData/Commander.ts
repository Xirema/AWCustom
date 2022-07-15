

export interface CommanderType {
    name:string;
    passiveUnitEffectsD2d?:string[];
    passiveTerrainEffectsD2d?:string[];
    passiveGlobalEffectsD2d?:string[];
    
    copCost?:number;
    passiveUnitEffectsCop?:string[];
    activeUnitEffectsCop?:string[];
    passiveTerrainEffectsCop?:string[];
    activeTerrainEffectsCop?:string[];
    passiveGlobalEffectsCop?:string[];
    activeGlobalEffectsCop?:string[];

    scopCost?:number;
    passiveUnitEffectsScop?:string[];
    activeUnitEffectsScop?:string[];
    passiveTerrainEffectsScop?:string[];
    activeTerrainEffectsScop?:string[];
    passiveGlobalEffectsScop?:string[];
    activeGlobalEffectsScop?:string[];

    coMeterMultiplier?:number;
}

export interface PlayerType {
    name:string;
    commanderTypeMod?:string;
    permittedPlayerSlots?:string[];
    permittedCommanderTypes?:string[];
    teamName?:string;
}