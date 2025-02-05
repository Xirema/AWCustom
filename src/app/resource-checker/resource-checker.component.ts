import { Component, OnInit } from "@angular/core";
import { GameResourceService } from "../services/game-resource.service";
import { ImageResource, PackMetadata, ResourcePack, TextResource } from "../GameResource/Resource";
import { firstValueFrom } from "rxjs";

@Component({
    selector: 'app-resource-checker',
    templateUrl: './resource-checker.component.html',
    styleUrls: ['./resource-checker.component.scss']
})
export class ResourceCheckerComponent implements OnInit {
    constructor(private resourceService:GameResourceService) {}
    metadatas:PackMetadata[] = [];
    packs:ResourcePack[] = [];
    textResources:TextResource[] = [];
    imageResources:ImageResource[] = [];
    selectedPacks = [];

    async ngOnInit(): Promise<void> {
        this.metadatas = await firstValueFrom(this.resourceService.listPacks());
    }

    async update(): Promise<void> {
        let packs = [];
        for(let id of this.selectedPacks) {
            packs.push(await firstValueFrom(this.resourceService.getResourcePack(id)));
        }
        this.packs = packs;
    }
}