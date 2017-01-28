export class PageData{
    Display: string;
    IsActive: boolean;

    constructor(display: string,
                isActive: boolean){
        this.Display = display;
        this.IsActive = isActive;
    }
}

export class Pagination{
    public TotalItems: number;
    public ItemsPerPage: number;
    public TotalPages: number;
    public PagesDisplay: PageData[];

    constructor(totalItems: number,
                itemsPerPage: number){
        this.TotalItems = totalItems;
        this.ItemsPerPage = itemsPerPage;
        this.TotalPages = Math.ceil(this.TotalItems / this.ItemsPerPage);
    }

    GetPageActive(): number{
        for (let idx:number = 0; idx < this.PagesDisplay.length; idx++){
            if (this.PagesDisplay[idx].IsActive){
                return parseInt(this.PagesDisplay[idx].Display);
            }
        }

        return 1;
    }

    SetPageActive(pageActive: number): void{
        let result: PageData[] = [];
        if (pageActive > this.TotalPages){
            pageActive = this.TotalPages;
        }
        if (pageActive < 1){
            pageActive = 1;
        }

        if (this.TotalPages <= 6){
            for (let id: number = 1; id <= this.TotalPages; id++){
                result.push(new PageData(id.toString(), false));
            }
            result[pageActive - 1].IsActive = true;
        }else{
            let pagesTemp: number[] = [];
            pagesTemp.push(1);
            pagesTemp.push(2);
            pagesTemp.push(this.TotalPages - 1);
            pagesTemp.push(this.TotalPages);

            // Add mid page
            let midPage = Math.floor((1 + this.TotalPages) / 2);
            let preMidPage = midPage - 1;
            let nextMidPage = midPage + 1;
            pagesTemp.push(preMidPage);
            pagesTemp.push(midPage);
            pagesTemp.push(nextMidPage);

            // Add active page
            pagesTemp.push(pageActive);

            // Add previous active page
            if (pageActive - 1 > 0){
                pagesTemp.push(pageActive - 1);
            }

            // Add next active page
            if (pageActive + 1 < this.TotalPages){
                pagesTemp.push(pageActive + 1);
            }

            // Sort pageActive
            pagesTemp = pagesTemp.sort((first: number, second: number) => first - second);

            for (let id:number = 0; id < pagesTemp.length; id++){
                let isActive = false;

                if (id + 1 == pageActive){
                    isActive = true;
                }

                if (id > 0){
                    let pageDist = pagesTemp[id] - pagesTemp[id - 1];
                    if (pageDist == 0){
                        continue;
                    }else if (pageDist == 1){
                        result.push(new PageData(pagesTemp[id].toString(), isActive));                        
                    }else if (pageDist > 1){
                        result.push(new PageData("...", false));
                        result.push(new PageData(pagesTemp[id].toString(), isActive));
                    }            
                }else{
                    result.push(new PageData(pagesTemp[id].toString(), isActive));
                }
            }

        }
        this.PagesDisplay = result;
        
    }
}
