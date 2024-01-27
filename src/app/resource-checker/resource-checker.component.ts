import { Component, OnInit } from "@angular/core";
import { GameResourceService } from "../services/game-resource.service";
import { ImageResource, TextResource } from "../GameResource/Resource";
import { firstValueFrom } from "rxjs";

@Component({
    selector: 'app-resource-checker',
    templateUrl: './resource-checker.component.html',
    styleUrls: ['./resource-checker.component.scss']
})
export class ResourceCheckerComponent implements OnInit {
    constructor(private resourceService:GameResourceService) {}
    packName = 'default';
    textResources:TextResource[] = [];
    imageResources:ImageResource[] = [];

    async ngOnInit(): Promise<void> {
        let packMetadata = await firstValueFrom(this.resourceService.getPackMetadata({name:this.packName}));
        let pack = await firstValueFrom(this.resourceService.getResourcePack(packMetadata.packId ?? ''));
        this.textResources = pack.textResources;
        this.imageResources = pack.imageResources;
    }
}