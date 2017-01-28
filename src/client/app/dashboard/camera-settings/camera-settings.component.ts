import { Component, OnInit} from '@angular/core';
import { Config } from '../../shared/index';
import { PageData, Pagination } from '../../utils/pagination.helper';

// Import Service
import { CameraService } from '../../service/camera-service';

// Import Models
import { TrafficPole, Camera, LatLon } from '../../service/models/CameraModel';

@Component({
    moduleId: module.id,
	selector: 'camera-settings-cmp',
	templateUrl: 'camera-settings.component.html',
    providers: [
        CameraService
    ]
})

export class CameraSettingsComponent implements OnInit {
    private NUM_ITEMS_PER_PAGE: number = 5;

    public TrafficPoles: TrafficPole[];
    public ChoiceTrafficPoles: boolean[];
    public Pages: Pagination;

    private selectedTrafficPole: number;    

    private isShowSuccessPopup: boolean;
    private isShowfailurePopup: boolean;
    private messagePopup: string;

    private TrafficPoleInfo: string;
   
    constructor(private cameraService: CameraService){
        this.TrafficPoles = [];        
        this.Pages = new Pagination(1, 1);

        this.selectedTrafficPole = -1;        

        this.isShowSuccessPopup = false;
        this.isShowfailurePopup = false;
        this.messagePopup = "";
    }

    ngOnInit() {
        this.getNumItems();
        this.getTrafficPoles(1);
	}

    createEmptyChoiceTrafficPole(): void{
        this.ChoiceTrafficPoles = [];
        for (let idx: number = 0; idx < this.TrafficPoles.length; idx++){
            this.ChoiceTrafficPoles.push(false);
        }
    }

    getTrafficPoles(page: number): void{
        (this.cameraService.GetTrafficPoles(page, this.NUM_ITEMS_PER_PAGE))
            .subscribe(
                (results: TrafficPole[]) =>{
                    this.TrafficPoles = results;
                    this.createEmptyChoiceTrafficPole()
                },
                (err: any) => {
                    console.log(err);
                },
                () => {
                }
            );
    }

    GetPage(page:number): void{
        this.Pages.SetPageActive(page);
        this.getTrafficPoles(page);
    }

    ClickDelete(poleId: number): void{
        this.selectedTrafficPole = poleId;
    }

    DeleteTrafficPole(): void{
        (this.cameraService.DeleteTrafficPole(this.selectedTrafficPole))
            .subscribe(
                (result: any) => {
                    if (result.status == "success"){
                        this.isShowSuccessPopup = true;
                        this.messagePopup = "Delete traffic pole"
                        setTimeout(() => {
                            this.isShowSuccessPopup = false;    
                        }, 2000);
                    }else{
                        this.isShowfailurePopup = true;
                        this.messagePopup = result.message;                        
                        setTimeout(() => {
                            this.isShowfailurePopup = false;
                        }, 2000);
                        
                    }

                    let currentPage = this.Pages.GetPageActive();
                    this.getNumItems(currentPage);
                },
                (err: any) => {
                    console.log(err);
                },
                () => {
                }
            );
    }

    ShowTrafficPoleInfo(trafficPole: TrafficPole): void{
        this.TrafficPoleInfo = trafficPole.ToJSON();
    }

    ClickPrevious(): void{
        let currentPage = this.Pages.GetPageActive();
        this.Pages.SetPageActive(currentPage - 1);
        this.getTrafficPoles(this.Pages.GetPageActive());
    }

    ClickNext(): void{
        let currentPage = this.Pages.GetPageActive();
        this.Pages.SetPageActive(currentPage + 1);
        this.getTrafficPoles(this.Pages.GetPageActive());
    }

    ClickCheckAll(element: any): void{
        for (let idx: number = 0; idx < this.ChoiceTrafficPoles.length; idx++){
            this.ChoiceTrafficPoles[idx] = element.checked;
        }
    }

    ClickCheck(event: any, idx: number): void{
        this.ChoiceTrafficPoles[idx] = event.target.checked;
        console.log(this.ChoiceTrafficPoles);
    }

    getNumItems(pageActive?: number): void{        
        (this.cameraService.GetNumTrafficPoles())
            .subscribe(
                (result: number) =>{
                    this.Pages = new Pagination(result, this.NUM_ITEMS_PER_PAGE);
                    if (pageActive){
                        this.Pages.SetPageActive(pageActive);
                        this.getTrafficPoles(this.Pages.GetPageActive());
                    }else{
                        this.Pages.SetPageActive(1);                        
                        this.getTrafficPoles(this.Pages.GetPageActive());
                    }                
                },
                (err: any) => {
                    console.log(err);
                },
                () => {
                }
            );        
    }

    delay(ms: number): any {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
