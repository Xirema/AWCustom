

export interface CommanderType {
    name:string;
    passiveUnitEffectsD2d:string[];
    passiveTerrainEffectsD2d:string[];
    passiveGlobalEffectsD2d:string[];
    
    copCost:number;
    passiveUnitEffectsCop:string[];
    activeUnitEffectsCop:string[];
    passiveTerrainEffectsCop:string[];
    activeTerrainEffectsCop:string[];
    passiveGlobalEffectsCop:string[];
    activeGlobalEffectsCop:string[];

    scopCost:number;
    passiveUnitEffectsScop:string[];
    activeUnitEffectsScop:string[];
    passiveTerrainEffectsScop:string[];
    activeTerrainEffectsScop:string[];
    passiveGlobalEffectsScop:string[];
    activeGlobalEffectsScop:string[];

    coMeterMultiplier:number;
}

export interface PlayerType {
    name:string;
    commanderTypeMod:string;
    permittedPlayerSlots:string[];
    permittedCommanderTypes:string[];
    teamName:string;
}

export class Player {
    public id:string;
    public userId:string;
    public commanderType:string;
    public playerType:string;
    public funds:number;
    public meterCharge:number;
    constructor(
        id:string,
        userId:string,
        commanderType:string,
        playerType:string,
        funds?:number,
        meterCharge?:number
    ) {
        this.id = id;
        this.userId = userId;
        this.commanderType = commanderType;
        this.playerType = playerType;
        this.funds = funds ?? 0;
        this.meterCharge = meterCharge ?? 0;
    }
}