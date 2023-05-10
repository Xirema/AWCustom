import { CommanderType, PlayerType } from "../GameData/Commander";
import { PassiveGlobalEffect, PassiveTerrainEffect, PassiveUnitEffect } from "../GameData/Effect";
import { TerrainType } from "../GameData/Terrain";
import { UnitType } from "../GameData/Unit";
import { GameDataService } from "../game-data.service";
import { GameStateService } from "../game-state.service";
import { stringHash } from "../util/hash-function";
import { HashMap } from "../util/hash-map";
import { GameState } from "./GameState";
import { PlayerState } from "./PlayerState";
import { SettingsState } from "./SettingsState";
import { TerrainState } from "./TerrainState";
import { UnitState } from "./UnitState";
import {lastValueFrom} from "rxjs";

// export async function getMovementRangeAdjustmentAsync(
//     gameId:string,
//     unitState:UnitState,
//     terrainState:TerrainState,
//     gameStateService:GameStateService,
//     gameDataService:GameDataService
// ):Promise<number> {
//     return new Promise<number>(async (resolve, reject) => {
//         let settingsFuture = lastValueFrom(gameStateService.getSettingState(gameId));
//         let gameFuture = lastValueFrom(gameStateService.getGameState(gameId));
//         let playersFuture = lastValueFrom(gameStateService.getPlayerStates(gameId));
    
//         let settingsState = await settingsFuture;
//         let modId = settingsState.modId;

//         let unitDataFuture = lastValueFrom(gameDataService.getUnitTypes(modId));
//         let coTypesFuture = lastValueFrom(gameDataService.getCommanderTypes(modId));
//         let effectsFuture = lastValueFrom(gameDataService.getPassiveUnitEffects(modId));
//         let playerTypeFuture = lastValueFrom(gameDataService.getPlayerTypes(modId));

//         let gameState = await gameFuture;
//         let players = await playersFuture;
//         let unitData = await unitDataFuture;
//         let coTypes = await coTypesFuture;
//         let effects = await effectsFuture;
//         let playerTypes = await playerTypeFuture;
//         let unitType = unitData.find(d => d.name === unitState.name);
//         if(!unitType) {
//             reject('Unable to find unit data for ' + unitState.name);
//             return;
//         }

//         resolve(getMovementRangeAdjustment(unitState, terrainState, unitType, gameState, settingsState, toHashMapId(players), toHashMapName(coTypes), toHashMapName(playerTypes), toHashMapName(effects)));
//     });
// }

export function getMovementRangeAdjustment(
    unitState:UnitState,
    terrainState:TerrainState,
    unitType:UnitType,
    gameState:GameState,
    settingsState:SettingsState,
    playerMap:HashMap<string, PlayerState>,
    coMap:HashMap<string, CommanderType>,
    playerTypeMap:HashMap<string, PlayerType>,
    effectMap:HashMap<string, PassiveUnitEffect>
):number {
    if(!unitState.owner) {
        return 0;
    }
    let player = playerMap.get(unitState.owner);
    if(!player) {
        throw new Error('Unable to get Player for ' + unitState.owner);
    }
    let effects = getAllApplicablePassiveUnitEffects(
        unitType,
        terrainState,
        player,
        settingsState,
        playerMap,
        playerTypeMap,
        coMap,
        effectMap,
        effect => effect.movementMod != null
    );
    let mod = 0;
    for(let effect of effects) {
        mod += effect.movementMod ?? 0;
    }
    return mod;
}

export function calculateMovementCostVariant(
    player:PlayerState,
    game:GameState,
    settings:SettingsState,
    players:HashMap<string, PlayerState>,
    playerTypes:HashMap<string, PlayerType>,
    commanderTypes:HashMap<string, CommanderType>,
    effects:HashMap<string, PassiveGlobalEffect>
):string {
    let validEffects = getAllApplicablePassiveGlobalEffects(
        player,
        settings,
        players,
        playerTypes,
        commanderTypes,
        effects,
        effect => effect.movementClassVariantOverride != null && effect.movementClassVariantReplace === game.variant
    );
    if(validEffects.length === 0) {
        return game.variant;
    }
    return validEffects[0].movementClassVariantOverride ?? game.variant;
}

export function getAllApplicablePassiveUnitEffects(
    unitType:UnitType,
    terrain:TerrainState,
    player:PlayerState,
    settings:SettingsState,
    players:HashMap<string, PlayerState>,
    playerTypes:HashMap<string, PlayerType>,
    commanderTypes:HashMap<string, CommanderType>,
    effects:HashMap<string, PassiveUnitEffect>,
    customTest?:(effect:PassiveUnitEffect) => boolean
):PassiveUnitEffect[] {
    let ret:PassiveUnitEffect[] = [];
    for(let playerPair of players) {
        let playerCandidate = playerPair.value;
        let sameAsPlayer = playerCandidate.id === player.id;
        let allyOfPlayer = !sameAsPlayer && playerCandidate.team != null && playerCandidate.team === player.team;
        let enemyOfPlayer = !sameAsPlayer && !allyOfPlayer;
        let playerType = playerTypes.get(playerCandidate.playerType);
        if(!playerType) {
            throw new Error('Unable to get Player Type for player ' + playerCandidate.playerType);
        }
        let baselineName = playerType.commanderTypeMod;
        let baselineCommander = (baselineName != null) ? commanderTypes.get(baselineName) : undefined;

        let realCommanderName = playerCandidate.commanderName;
        let realCommander = commanderTypes.get(realCommanderName);
        if(!realCommander) {
            throw new Error('Unable to get Commander Type for ' + realCommanderName);
        }
        let candidateEffectNames = 
            [
                ...(baselineCommander?.passiveUnitEffectsD2d ?? []),
                ...((playerCandidate.powerActive === 'cop' ? baselineCommander?.passiveUnitEffectsCop : undefined) ?? []),
                ...((playerCandidate.powerActive === 'scop' ? baselineCommander?.passiveUnitEffectsScop : undefined) ?? []),
                ...((settings.coPowers ? realCommander?.passiveUnitEffectsD2d : undefined) ?? []),
                ...((playerCandidate.powerActive === 'cop' ? realCommander?.passiveUnitEffectsCop : undefined) ?? []),
                ...((playerCandidate.powerActive === 'scop' ? realCommander?.passiveUnitEffectsScop : undefined) ?? [])
            ]
        ;
        
        let realEffects =
            candidateEffectNames.map(name => {
                let ret = effects.get(name);
                if(!ret) {
                    throw new Error('Unable to get Passive Unit Effect for ' + name);
                }
                return ret;
            })
            .filter(effect => {
                let matchesPlayer =
                    sameAsPlayer && (effect.targets?.some(target => target === 'self' || target === 'own') ?? false) ||
                    allyOfPlayer && (effect.targets?.some(target => target === 'ally') ?? false) ||
                    enemyOfPlayer && (effect.targets?.some(target => target === 'enemy') ?? false)
                ;
                let unitMatches = unitQualifiesForEffect(unitType, terrain.name, effect);
                let passesCustomTest = (customTest != null ? customTest(effect) : true);
                return matchesPlayer && unitMatches && passesCustomTest;
            })
        ;
        ret = [...ret, ...realEffects];
    }
    return ret;
}

export function getAllApplicablePassiveTerrainEffects(
    terrain:TerrainState,
    player:PlayerState,
    settings:SettingsState,
    players:HashMap<string, PlayerState>,
    playerTypes:HashMap<string, PlayerType>,
    commanderTypes:HashMap<string, CommanderType>,
    effects:HashMap<string, PassiveTerrainEffect>,
    customTest?:(effect:PassiveTerrainEffect) => boolean
):PassiveTerrainEffect[] {
    let ret:PassiveTerrainEffect[] = [];
    let terrainOwner = terrain.owner != null ? players.get(terrain.owner) : undefined;
    let belongsToPlayer = terrainOwner?.id === player.id;
    let belongsToAlly = terrainOwner?.team != null && terrainOwner.team === player.team;
    let belongsToNeutral = terrainOwner == null;
    let belongsToEnemy = !belongsToPlayer && !belongsToAlly && !belongsToNeutral;
    for(let playerPair of players) {
        let playerCandidate = playerPair.value;
        let sameAsPlayer = playerCandidate.id === player.id;
        let allyOfPlayer = !sameAsPlayer && playerCandidate.team != null && playerCandidate.team === player.team;
        let enemyOfPlayer = !sameAsPlayer && !allyOfPlayer;
        let playerType = playerTypes.get(playerCandidate.playerType);
        if(!playerType) {
            throw new Error('Unable to get Player Type for player ' + playerCandidate.playerType);
        }
        let baselineName = playerType.commanderTypeMod;
        let baselineCommander = (baselineName != null) ? commanderTypes.get(baselineName) : undefined;

        let realCommanderName = playerCandidate.commanderName;
        let realCommander = commanderTypes.get(realCommanderName);
        if(!realCommander) {
            throw new Error('Unable to get Commander Type for ' + realCommanderName);
        }
        let candidateEffectNames = 
            [
                ...(baselineCommander?.passiveTerrainEffectsD2d ?? []),
                ...((playerCandidate.powerActive === 'cop' ? baselineCommander?.passiveTerrainEffectsCop : undefined) ?? []),
                ...((playerCandidate.powerActive === 'scop' ? baselineCommander?.passiveTerrainEffectsScop : undefined) ?? []),
                ...((settings.coPowers ? realCommander?.passiveTerrainEffectsD2d : undefined) ?? []),
                ...((playerCandidate.powerActive === 'cop' ? realCommander?.passiveTerrainEffectsCop : undefined) ?? []),
                ...((playerCandidate.powerActive === 'scop' ? realCommander?.passiveTerrainEffectsScop : undefined) ?? [])
            ]
        ;
        
        let realEffects =
            candidateEffectNames.map(name => {
                let ret = effects.get(name);
                if(!ret) {
                    throw new Error('Unable to get Passive Terrain Effect for ' + name);
                }
                return ret;
            })
            .filter(effect => {
                let targetMatchesPlayer =
                    sameAsPlayer && (effect.targets?.some(target => target === 'self' || target === 'own') ?? false) ||
                    allyOfPlayer && (effect.targets?.some(target => target === 'ally') ?? false) ||
                    enemyOfPlayer && (effect.targets?.some(target => target === 'enemy') ?? false)
                ;
                let affectMatchesPlayer =
                    belongsToPlayer && (effect.affects?.some(affect => affect === 'self' || affect === 'own') ?? false) ||
                    belongsToAlly && (effect.affects?.some(affect => affect === 'ally') ?? false) ||
                    belongsToNeutral && (effect.affects?.some(affect => affect === 'neutral') ?? false) ||
                    belongsToEnemy && (effect.affects?.some(affect => affect === 'enemy') ?? false)
                ;
                let terrainMatches = effect.terrainRequired?.some(required => required === terrain.name) ?? true;
                let passesCustomTest = (customTest != null ? customTest(effect) : true);
                return targetMatchesPlayer && 
                    affectMatchesPlayer &&
                    terrainMatches &&
                    passesCustomTest
                ;
            });
        ;
        ret = [...ret, ...realEffects];
    }
    return ret;
}

export function getAllApplicablePassiveGlobalEffects(
    player:PlayerState,
    settings:SettingsState,
    players:HashMap<string, PlayerState>,
    playerTypes:HashMap<string, PlayerType>,
    commanderTypes:HashMap<string, CommanderType>,
    effects:HashMap<string, PassiveGlobalEffect>,
    customTest?:(effect:PassiveGlobalEffect) => boolean
):PassiveGlobalEffect[] {
    let ret:PassiveGlobalEffect[] = [];
    for(let playerPair of players) {
        let playerCandidate = playerPair.value;
        let sameAsPlayer = playerCandidate.id === player.id;
        let allyOfPlayer = !sameAsPlayer && playerCandidate.team != null && playerCandidate.team === player.team;
        let enemyOfPlayer = !sameAsPlayer && !allyOfPlayer;
        let playerType = playerTypes.get(playerCandidate.playerType);
        if(!playerType) {
            throw new Error('Unable to get Player Type for player ' + playerCandidate.playerType);
        }
        let baselineName = playerType.commanderTypeMod;
        let baselineCommander = (baselineName != null) ? commanderTypes.get(baselineName) : undefined;

        let realCommanderName = playerCandidate.commanderName;
        let realCommander = commanderTypes.get(realCommanderName);
        if(!realCommander) {
            throw new Error('Unable to get Commander Type for ' + realCommanderName);
        }
        let candidateEffectNames = 
            [
                ...(baselineCommander?.passiveGlobalEffectsD2d ?? []),
                ...((playerCandidate.powerActive === 'cop' ? baselineCommander?.passiveGlobalEffectsCop : undefined) ?? []),
                ...((playerCandidate.powerActive === 'scop' ? baselineCommander?.passiveGlobalEffectsScop : undefined) ?? []),
                ...((settings.coPowers ? realCommander?.passiveGlobalEffectsD2d : undefined) ?? []),
                ...((playerCandidate.powerActive === 'cop' ? realCommander?.passiveGlobalEffectsCop : undefined) ?? []),
                ...((playerCandidate.powerActive === 'scop' ? realCommander?.passiveGlobalEffectsScop : undefined) ?? [])
            ]
        ;
        
        let realEffects =
            candidateEffectNames.map(name => {
                let ret = effects.get(name);
                if(!ret) {
                    throw new Error('Unable to get Passive Global Effect for ' + name);
                }
                return ret;
            })
            .filter(effect => {
                let targetMatchesPlayer =
                    sameAsPlayer && (effect.targets?.some(target => target === 'self' || target === 'own') ?? false) ||
                    allyOfPlayer && (effect.targets?.some(target => target === 'ally') ?? false) ||
                    enemyOfPlayer && (effect.targets?.some(target => target === 'enemy') ?? false) ||
                    !effect.targets
                ;
                let passesCustomTest = (customTest != null ? customTest(effect) : true);
                return targetMatchesPlayer && 
                    passesCustomTest
                ;
            });
        ;
        ret = [...ret, ...realEffects];
    }
    return ret;
}

export function unitQualifiesForEffect(
    unitType:UnitType,
    terrainName:string,
    effect:PassiveUnitEffect
):boolean {
    //If the unit type is in the list, then it counts. No ifs ands or buts
    let unitTypeRequired = !!effect.unitTypeRequired;
    let unitTypeMatches = effect.unitTypeRequired != null && effect.unitTypeRequired.some(name => name === unitType.name);
    let terrainTypeRequired = !!effect.terrainRequired;
    let terrainTypeMatches = effect.terrainRequired != null && effect.terrainRequired.some(terrain => terrain === terrainName);
    let classificationRequired = !!effect.classificationRequired;
    let classificationMatches = effect.classificationRequired != null && effect.classificationRequired.every(classification => {
        if(classification[0] === '!') {
            return !unitType.classifications.some(name => name === classification.substring(1));
        }
        return unitType.classifications.some(name => name === classification);
    });
    if(terrainTypeRequired && !terrainTypeMatches) {
        return false;
    }
    if(unitTypeRequired) {
        return unitTypeMatches;
    }
    if(classificationRequired) {
        return classificationMatches;
    }

    return true;

}

function isEnemyOf(
    playerA:PlayerState,
    playerB:PlayerState
):boolean {
    return playerA.team == null
    || playerB.team == null
    || playerA.team !== playerB.team
    ;
}

function toHashMapName<Type extends {name:string}>(elements:Type[]):HashMap<string, Type> {
    let ret = new HashMap<string, Type>(stringHash);

    elements.forEach(element => {
        ret.put(element.name, element)
    });
    return ret;
}

function toHashMapId<Type extends {id:string}>(elements:Type[]):HashMap<string, Type> {
    let ret = new HashMap<string, Type>(stringHash);

    elements.forEach(element => {
        ret.put(element.id, element)
    });
    return ret;
}